import { DataEntry, DataEntryFactory, StateDataType } from 'url-safe-bitpacking';
import { create } from 'zustand';
import { throttle } from './throttle';
import { AppleStateDataStore } from './DataStore';
import { VersionAppletDataType } from '../modelDefinition/types/versionApplet.data.type';

export const useAppletData = create<AppleStateDataStore>((set, get) => ({
  versionHandler: null,
  setVersionHandler: (versionHandler) => set(() => ({ versionHandler })),
  data: { version: DataEntryFactory.createVersion(0) },
  setData: (data) => set((state) => ({ ...state, data })),
  updateDataEntry: (data: DataEntry | DataEntry[]) => throttle(() => useAppletData.getState().updateDataEntryNonThrottled(data))(),
  updateDataEntryNonThrottled: (update: DataEntry | DataEntry[]) => {
    if (!get().versionHandler) return;
    // add current state to the undoStack
    const currentStateString = get().versionHandler!.stringify(get().data);
    get()._pushUndo(currentStateString);
    // setting the new state
    const newState = get().versionHandler!.updater(get().data as unknown as StateDataType, update) as unknown as VersionAppletDataType;
    get().setData(newState);
  },
  canUndo: false,
  _pushUndo: (currentStateString: string) => set((s) => ({ undoStack: [...s.undoStack, currentStateString], canUndo: true })),
  undo: () => {
    // push current state to the redo stack
    const currentStateString = get().versionHandler!.stringify(get().data);
    const undoStack = [...get().undoStack];
    const newStateString = undoStack.pop()!;
    const data = get().versionHandler!.parser(newStateString) as unknown as StateDataType & VersionAppletDataType;
    set(() => ({
      canRedo: true,
      undoStack,
      data,
      redoStack: [...get().redoStack, currentStateString],
      canUndo: Boolean(undoStack.length),
    }));
  },
  canRedo: false,
  redo: () => {
    // push current state to the redo stack
    const currentStateString = get().versionHandler!.stringify(get().data);
    const redoStack = [...get().redoStack];
    const newStateString = redoStack.pop()!;
    const data = get().versionHandler!.parser(newStateString) as unknown as StateDataType & VersionAppletDataType;
    set(() => ({
      canUndo: true,
      redoStack,
      data,
      undoStack: [...get().undoStack, currentStateString],
      canRedo: Boolean(redoStack.length),
    }));
  },
  undoStack: [],
  redoStack: [],
  isWaiting: false,
}));
