import { DataEntry } from 'url-safe-bitpacking';
import { create } from 'zustand';
import { parserObjects } from '../modelDefinition/model';
import { StateDataStore } from './DataStore';
import { throttle } from './throttle';

export const useMethodData = create<StateDataStore>((set, get) => ({
  data: parserObjects.parser(),
  setData: (data) => set((state) => ({ ...state, data })),
  updateDataEntry: (data: DataEntry | DataEntry[]) => throttle(() => useMethodData.getState().updateDataEntryNonThrottled(data))(),
  updateDataEntryNonThrottled: (update: DataEntry | DataEntry[]) => {
    // add current state to the undoStack
    const currentStateString = parserObjects.stringify(get().data);
    get()._pushUndo(currentStateString);
    // setting the new state
    const newState = parserObjects.updater(get().data, update);
    get().setData(newState);
  },
  canUndo: false,
  _pushUndo: (currentStateString: string) => set((s) => ({ undoStack: [...s.undoStack, currentStateString], canUndo: true })),
  undo: () => {
    // push current state to the redo stack
    const currentStateString = parserObjects.stringify(get().data);
    const undoStack = [...get().undoStack];
    const newStateString = undoStack.pop()!;
    const data = parserObjects.parser(newStateString);
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
    const currentStateString = parserObjects.stringify(get().data);
    const redoStack = [...get().redoStack];
    const newStateString = redoStack.pop()!;
    const data = parserObjects.parser(newStateString);
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
