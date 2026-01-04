import { EnumOptionsNode } from 'url-safe-bitpacking';
import { create } from 'zustand';
import { SymbolNameType } from '../specificInputs/NameEditor';

type MethodStore = {
  method: EnumOptionsNode | null;
  methodIndex: number;
  setMethodNode: (method: EnumOptionsNode, index: number) => void;
  clearMethodNode: () => void;
  numericInputNames: SymbolNameType[];
  setNumericInputNames: (numericInputNames: SymbolNameType[]) => void;
  methodInputNames: SymbolNameType[];
  setMethodInputNames: (methodInputNames: SymbolNameType[]) => void;
};

export const useMethodStore = create<MethodStore>((set) => ({
  method: null,
  methodIndex: 0,
  setMethodNode: (method: EnumOptionsNode, index: number) => set({ method, methodIndex: index }),
  clearMethodNode: () => set({ method: null, methodIndex: 0 }),
  numericInputNames: [],
  setMethodInputNames: (methodInputNames: SymbolNameType[]) => set({ methodInputNames }),
  methodInputNames: [],
  setNumericInputNames: (numericInputNames: SymbolNameType[]) => set({ numericInputNames })
}));
