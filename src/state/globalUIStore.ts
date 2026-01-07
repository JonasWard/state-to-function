import { create } from 'zustand';

type GlobalUIStore = {
  isDesktop: boolean;
  setIsDesktop: (isDesktop: boolean) => void;
};

export const useGlobalUIStore = create<GlobalUIStore>((set) => ({
  isDesktop: false,
  setIsDesktop: (isDesktop: boolean) => set({ isDesktop })
}));
