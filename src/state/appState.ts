import { create } from 'zustand';
import { useGlobalUIStore } from './globalUIStore';

type AppStateStore = {
  base64InputStateString: string | null;
  base64AppletStateString: string | null;
  inputStateStringStack: string[];
  inputStateStringStackCurrentIndex: number;
  /**
   * Adds a new input state string to the stack
   * If the current index is the last one, it will just add it (if it is not the same as the current one)
   * If the current index is smaller than the last one, **It will get rid of the states after the current index**
   * This method doesn't take care of validation
   * @param base64InputStateString - The `base64` string that represents the input state
   */
  addInputStateStringToStack: (base64InputStateString: string) => void;
  clearInputStateStringToStack: () => void;
  appletStateStringStack: string[];
  appletStateStringStackCurrentIndex: number;
  /**
   * Adds a new input state string to the stack
   * If the current index is the last one, it will just add it (if it is not the same as the current one)
   * If the current index is smaller than the last one, **It will get rid of the states after the current index**
   * This method doesn't take care of validation
   * @param base64AppletStateString - The `base64` string that represents the input state
   */
  addAppletStateStringToStack: (base64AppletStateString: string) => void;
  clearAppletStateStringToStack: () => void;
  undoInputStateString: () => void;
  undoAppletStateString: () => void;
  redoInputStateString: () => void;
  redoAppletStateString: () => void;
  canUndoInput: boolean;
  canRedoInput: boolean;
  canUndoApplet: boolean;
  canRedoApplet: boolean;
  /**
   * Helper method that handles a stack change
   * If length is 0 it will de-factor clear the stack
   * @param inputStateStringStack
   */
  setInputStack: (inputStateStringStack: string[]) => void;
  /**
   * Helper method that handles a stack change
   * If length is 0 it will de-factor clear the stack
   * @param inputStateStringStack
   */
  setAppletStack: (appletStateStringStack: string[]) => void;
};

export const useAppState = create<AppStateStore>()((set, get) => ({
  base64InputStateString: null,
  base64AppletStateString: null,
  inputStateStringStack: [],
  inputStateStringStackCurrentIndex: -1,
  appletStateStringStack: [],
  appletStateStringStackCurrentIndex: -1,
  canUndoInput: false,
  canRedoInput: false,
  canUndoApplet: false,
  canRedoApplet: false,
  setInputStack: (inputStateStringStack: string[]) => {
    if (inputStateStringStack.length > 0) {
      const base64InputStateString = inputStateStringStack[inputStateStringStack.length - 1] ?? null;
      set(() => ({
        inputStateStringStack,
        inputStateStringStackCurrentIndex: inputStateStringStack.length - 1,
        base64InputStateString,
        canUndoInput: inputStateStringStack.length > 1,
        canRedoInput: false
      }));
      window.location.hash = `${base64InputStateString ?? ''}`;
    } else {
      set(() => ({
        inputStateStringStack: [],
        inputStateStringStackCurrentIndex: -1,
        base64InputStateString: null,
        canUndoInput: false,
        canRedoInput: false
      }));
      window.location.hash = ``;
    }
  },
  setAppletStack: (appletStateStringStack: string[]) => {
    if (appletStateStringStack.length > 0) {
      const base64AppletStateString = appletStateStringStack[appletStateStringStack.length - 1] ?? null;
      set(() => ({
        appletStateStringStack,
        appletStateStringStackCurrentIndex: appletStateStringStack.length - 1,
        base64AppletStateString,
        canUndoApplet: appletStateStringStack.length > 1,
        canRedoApplet: false
      }));
      window.location.hash = `${get().base64InputStateString ?? ''}/${base64AppletStateString ?? ''}`;
    } else {
      set(() => ({
        appletStateStringStack: [],
        appletStateStringStackCurrentIndex: -1,
        base64AppletStateString: null,
        canUndoApplet: false,
        canRedoApplet: false
      }));
      window.location.hash = `${get().base64InputStateString ?? ''}/`;
    }
  },
  addInputStateStringToStack: (iNs) =>
    get().inputStateStringStack[get().inputStateStringStackCurrentIndex] !== iNs
      ? get().setInputStack([...get().inputStateStringStack.slice(0, get().inputStateStringStackCurrentIndex + 1), iNs])
      : void 0,
  addAppletStateStringToStack: (aNs) =>
    get().appletStateStringStack[get().appletStateStringStackCurrentIndex] !== aNs
      ? get().setAppletStack([
          ...get().appletStateStringStack.slice(0, get().appletStateStringStackCurrentIndex + 1),
          aNs
        ])
      : void 0,
  clearInputStateStringToStack: () => get().setInputStack([]),
  clearAppletStateStringToStack: () => get().setAppletStack([]),
  undoInputStateString: () => {
    if (!get().canUndoInput) return;
    set((state) => ({
      inputStateStringStackCurrentIndex: state.inputStateStringStackCurrentIndex - 1,
      base64InputStateString: state.inputStateStringStack[state.inputStateStringStackCurrentIndex - 1] ?? null,
      canRedoInput: true,
      canUndoInput: state.inputStateStringStackCurrentIndex - 1 > 0
    }));
    useGlobalUIStore.getState().setLoading(true);
  },
  redoInputStateString: () => {
    if (get().inputStateStringStackCurrentIndex >= get().inputStateStringStack.length - 1) return;
    set((state) => ({
      inputStateStringStackCurrentIndex: state.inputStateStringStackCurrentIndex + 1,
      base64InputStateString: state.inputStateStringStack[state.inputStateStringStackCurrentIndex + 1] ?? null,
      canUndoInput: true,
      canRedoInput: state.inputStateStringStackCurrentIndex + 1 < state.inputStateStringStack.length - 1
    }));
    useGlobalUIStore.getState().setLoading(true);
  },
  undoAppletStateString: () => {
    if (get().appletStateStringStackCurrentIndex < 1) return;
    set((state) => ({
      appletStateStringStackCurrentIndex: state.appletStateStringStackCurrentIndex - 1,
      base64AppletStateString: state.appletStateStringStack[state.appletStateStringStackCurrentIndex - 1] ?? null,
      canRedoApplet: true,
      canUndoApplet: state.appletStateStringStackCurrentIndex - 1 > 0
    }));
    useGlobalUIStore.getState().setLoading(true);
  },
  redoAppletStateString: () => {
    if (get().appletStateStringStackCurrentIndex >= get().appletStateStringStack.length - 1) return;
    set((state) => ({
      appletStateStringStackCurrentIndex: state.appletStateStringStackCurrentIndex + 1,
      base64AppletStateString: state.appletStateStringStack[state.appletStateStringStackCurrentIndex + 1] ?? null,
      canUndoApplet: true,
      canRedoApplet: state.appletStateStringStackCurrentIndex + 1 < state.appletStateStringStack.length - 1
    }));
    useGlobalUIStore.getState().setLoading(true);
  }
}));
