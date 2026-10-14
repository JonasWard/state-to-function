import { useMemo } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { encodeApplet, reconcileOverrides, resolveInputValues } from '../model/appletSchema';
import { encodeDefinition, normalizeDefinition } from '../model/codec';
import { DEFAULT_DEFINITION } from '../model/defaults';
import { evaluate } from '../model/evaluate';
import { AppletOverrides, Definition } from '../model/types';
import { notify } from './notify';

const HISTORY_LIMIT = 200;
const COALESCE_MS = 800;

export interface Snapshot {
  definition: Definition;
  overrides: AppletOverrides;
  defString: string;
  appletString: string;
}

interface CommitOptions {
  /** consecutive commits with the same key within a short window share one undo step (e.g. slider drags) */
  coalesceKey?: string;
}

interface DocumentState extends Snapshot {
  status: 'ready' | 'upgrading';
  history: Snapshot[];
  historyIndex: number;
  lastCoalesceKey?: string;
  lastCommitAt: number;
  commit: (next: { definition?: Definition; overrides?: AppletOverrides }, options?: CommitOptions) => boolean;
  updateDefinition: (fn: (d: Definition) => Definition, options?: CommitOptions) => boolean;
  setOverride: (inputIndex: number, value: number | null, options?: CommitOptions) => void;
  resetApplet: () => void;
  undo: () => void;
  redo: () => void;
  load: (definition: Definition, overrides: AppletOverrides, mode: 'reset' | 'push') => void;
  setStatus: (status: DocumentState['status']) => void;
}

/** Normalises and encodes; throws if densing rejects the data. */
export const createSnapshot = (definition: Definition, overrides: AppletOverrides): Snapshot => {
  const def = normalizeDefinition(definition);
  const fitted = reconcileOverrides(def, overrides);
  return { definition: def, overrides: fitted, defString: encodeDefinition(def), appletString: encodeApplet(def, fitted) };
};

const pick = ({ definition, overrides, defString, appletString }: Snapshot): Snapshot => ({
  definition,
  overrides,
  defString,
  appletString
});

const initial = createSnapshot(DEFAULT_DEFINITION, []);

export const useDocumentStore = create<DocumentState>()(
  subscribeWithSelector((set, get) => ({
    ...initial,
    status: 'ready',
    history: [initial],
    historyIndex: 0,
    lastCommitAt: 0,

    commit: (next, options = {}) => {
      const state = get();
      let snapshot: Snapshot;
      try {
        snapshot = createSnapshot(next.definition ?? state.definition, next.overrides ?? state.overrides);
      } catch (e) {
        console.error(e);
        notify.error('That change could not be stored in the link.');
        return false;
      }
      if (snapshot.defString === state.defString && snapshot.appletString === state.appletString) {
        // still adopt the object so controlled inputs re-sync with the normalised value
        set({ definition: snapshot.definition, overrides: snapshot.overrides });
        return true;
      }
      const now = Date.now();
      const coalesce =
        options.coalesceKey !== undefined &&
        options.coalesceKey === state.lastCoalesceKey &&
        now - state.lastCommitAt < COALESCE_MS;
      const base = state.history.slice(0, state.historyIndex + (coalesce ? 0 : 1));
      const history = [...base, snapshot].slice(-HISTORY_LIMIT);
      set({ ...snapshot, history, historyIndex: history.length - 1, lastCoalesceKey: options.coalesceKey, lastCommitAt: now });
      return true;
    },

    updateDefinition: (fn, options) => get().commit({ definition: fn(get().definition) }, options),

    setOverride: (inputIndex, value, options) =>
      void get().commit({ overrides: get().overrides.map((o, i) => (i === inputIndex ? value : o)) }, options),

    resetApplet: () => void get().commit({ overrides: [] }),

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) set({ ...history[historyIndex - 1], historyIndex: historyIndex - 1, lastCoalesceKey: undefined });
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1)
        set({ ...history[historyIndex + 1], historyIndex: historyIndex + 1, lastCoalesceKey: undefined });
    },

    load: (definition, overrides, mode) => {
      const snapshot = createSnapshot(definition, overrides);
      if (mode === 'reset') return set({ ...snapshot, history: [snapshot], historyIndex: 0, lastCoalesceKey: undefined });
      const state = get();
      if (snapshot.defString === state.defString && snapshot.appletString === state.appletString) return;
      const history = [...state.history.slice(0, state.historyIndex + 1), snapshot].slice(-HISTORY_LIMIT);
      set({ ...snapshot, history, historyIndex: history.length - 1, lastCoalesceKey: undefined });
    },

    setStatus: (status) => set({ status })
  }))
);

export const selectCanUndo = (s: DocumentState) => s.historyIndex > 0;
export const selectCanRedo = (s: DocumentState) => s.historyIndex < s.history.length - 1;
export const currentSnapshot = () => pick(useDocumentStore.getState());

/** Input values (overrides or defaults) and method results for the current document. */
export const useEvaluation = () => {
  const definition = useDocumentStore((s) => s.definition);
  const overrides = useDocumentStore((s) => s.overrides);
  return useMemo(() => {
    const values = resolveInputValues(definition, overrides);
    return { values, results: evaluate(definition, values) };
  }, [definition, overrides]);
};
