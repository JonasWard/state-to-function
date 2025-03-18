import { DataEntry } from 'url-safe-bitpacking';
import { StateDataType, VersionHandler } from 'url-safe-bitpacking/dist/types';
import { VersionAppletDataType } from '../modelDefinition/types/versionApplet.data.type';

export type StateDataStore = {
  data: StateDataType;
  setData: (s: StateDataType) => void;
  updateDataEntry: (data: DataEntry | DataEntry[]) => void;
  updateDataEntryNonThrottled: (data: DataEntry | DataEntry[]) => void;
  canUndo: boolean;
  _pushUndo: (stateString: string) => void;
  undo: () => void;
  canRedo: boolean;
  redo: () => void;
  undoStack: string[];
  redoStack: string[];
  isWaiting: boolean;
};

export type AppleStateDataStore = StateDataStore & {
  data: VersionAppletDataType;
  setData: (s: VersionAppletDataType) => void;
  versionHandler: VersionHandler | null;
  setVersionHandler: (versionHandle: VersionHandler) => void;
};
