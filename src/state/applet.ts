import { DataEntry, DataEntryFactory, StateDataType } from 'url-safe-bitpacking';
import { create } from 'zustand';
import { throttle } from './throttle';
import { AppleStateDataStore } from './DataStore';
import { VersionAppletDataType } from '../modelDefinition/types/versionApplet.data.type';

export const useAppletData = create<AppleStateDataStore>((set) => ({
  versionHandler: null,
  setVersionHandler: (versionHandler) => set(() => ({ versionHandler })),
  data: { version: DataEntryFactory.createVersion(0) },
  setData: (data) => set((state) => ({ ...state, data })),
  updateDataEntry: (data: DataEntry | DataEntry[]) => throttle(() => useAppletData.getState().updateDataEntryNonThrottled(data))(),
  updateDataEntryNonThrottled: (update: DataEntry | DataEntry[]) =>
    useAppletData.getState().versionHandler &&
    useAppletData
      .getState()
      .setData(
        useAppletData.getState().versionHandler!.updater(useAppletData.getState().data as unknown as StateDataType, update) as unknown as VersionAppletDataType
      ),
  undo: () => {},
  redo: () => {},
  undoStack: [],
  redoStack: [],
  isWaiting: false,
}));
