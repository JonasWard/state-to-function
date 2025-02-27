import { DataEntry, StateDataType } from 'url-safe-bitpacking'
import { create } from 'zustand'
import { parserObjects } from '../modelDefinition/model'

const throttle = <T extends unknown[]>(callback: (...args: T) => void) => {
  return (...args: T) => {
    if (useData.getState().isWaiting) return
    callback(...args)
    useData.setState({ isWaiting: true })
    setTimeout(() => useData.setState({ isWaiting: false }), 101)
  }
}

type DataStore = {
  data: StateDataType
  setData: (s: StateDataType) => void
  updateDataEntry: (data: DataEntry | DataEntry[]) => void
  updateDataEntryNonThrottled: (data: DataEntry | DataEntry[]) => void
  undo: () => void
  redo: () => void
  undoStack: string[]
  redoStack: string[]
  isWaiting: boolean
}

export const useData = create<DataStore>((set) => ({
  data: parserObjects.parser(),
  setData: (data) => set((state) => ({ ...state, data })),
  updateDataEntry: (data: DataEntry | DataEntry[]) =>
    throttle(() => useData.getState().updateDataEntryNonThrottled(data))(),
  updateDataEntryNonThrottled: (update: DataEntry | DataEntry[]) =>
    useData.getState().setData(parserObjects.updater(useData.getState().data, update)),
  undo: () => {},
  redo: () => {},
  undoStack: [],
  redoStack: [],
  isWaiting: false,
}))
