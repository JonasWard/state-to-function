import { DataEntry } from 'url-safe-bitpacking';
import { create } from 'zustand';
import { parserObjects } from '../modelDefinition/model';
import { StateDataStore } from './DataStore';
import { throttle } from './throttle';

export const useMethodData = create<StateDataStore>((set) => ({
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
