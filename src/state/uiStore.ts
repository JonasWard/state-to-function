import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { View } from './hash';

export interface Settings {
  showNamesInApplet: boolean;
  compactRows: boolean;
  showRangeHints: boolean;
  typeFormulas: boolean;
}

interface UIState {
  view: View;
  setView: (view: View) => void;
  mobilePane: 'inputs' | 'methods';
  setMobilePane: (pane: UIState['mobilePane']) => void;
  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      view: 'edit',
      setView: (view) => set({ view }),
      mobilePane: 'inputs',
      setMobilePane: (mobilePane) => set({ mobilePane }),
      settings: { showNamesInApplet: true, compactRows: false, showRangeHints: true, typeFormulas: false },
      setSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } }))
    }),
    {
      name: 'stf-settings-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ settings: s.settings }),
      // stored settings from an older version lack newer keys; those keep their defaults
      merge: (stored, current) => ({
        ...current,
        settings: { ...current.settings, ...(stored as Partial<UIState> | undefined)?.settings }
      })
    }
  )
);
