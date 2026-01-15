import { create } from 'zustand';
import { useAppState } from './appState';

type GlobalUIStore = {
  isDesktop: boolean;
  setIsDesktop: (isDesktop: boolean) => void;
  uiInFocus: null | 'method' | 'numeric' | 'applet';
  setUiInFocus: (uiInFocus: null | 'method' | 'numeric' | 'applet') => void;
};

export const useGlobalUIStore = create<GlobalUIStore>((set) => ({
  isDesktop: false,
  setIsDesktop: (isDesktop: boolean) => set({ isDesktop }),
  uiInFocus: null,
  setUiInFocus: (uiInFocus: null | 'method' | 'numeric' | 'applet') => {
    if (uiInFocus !== 'applet') window.location.hash = `${useAppState.getState().base64InputStateString ?? ''}`;
    else
      window.location.hash = `${useAppState.getState().base64InputStateString ?? ''}/${
        useAppState.getState().base64AppletStateString ?? ''
      }`;
    set({ uiInFocus });
  }
}));
