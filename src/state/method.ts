import { DataEntry, StateDataType } from 'url-safe-bitpacking';
import { create } from 'zustand';
import { parserObjects } from '../modelDefinition/model';

const throttle = <T extends unknown[]>(callback: (...args: T) => void) => {
  return (...args: T) => {
    if (useMethodData.getState().isWaiting) return;
    callback(...args);
    useMethodData.setState({ isWaiting: true });
    setTimeout(() => useMethodData.setState({ isWaiting: false }), 101);
  };
};

type DataStore = {
  data: StateDataType;
  setData: (s: StateDataType) => void;
  updateDataEntry: (data: DataEntry | DataEntry[]) => void;
  updateDataEntryNonThrottled: (data: DataEntry | DataEntry[]) => void;
  undo: () => void;
  redo: () => void;
  undoStack: string[];
  redoStack: string[];
  isWaiting: boolean;
};

export const useMethodData = create<DataStore>((set) => ({
  data: parserObjects.parser(),
  setData: (data) => set((state) => ({ ...state, data })),
  updateDataEntry: (data: DataEntry | DataEntry[]) => throttle(() => useMethodData.getState().updateDataEntryNonThrottled(data))(),
  updateDataEntryNonThrottled: (update: DataEntry | DataEntry[]) =>
    useMethodData.getState().setData(parserObjects.updater(useMethodData.getState().data, update)),
  undo: () => {},
  redo: () => {},
  undoStack: [],
  redoStack: [],
  isWaiting: false,
}));
