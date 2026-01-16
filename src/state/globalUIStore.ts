import { create } from 'zustand';
import { useAppState } from './appState';
import { UI_STATES } from './c';

type GlobalUIStore = {
  isDesktop: boolean;
  setIsDesktop: (isDesktop: boolean) => void;
  uiInFocus: (typeof UI_STATES)[number];
  setUiInFocus: (uiInFocus: (typeof UI_STATES)[number]) => void;
  showNamesInApplet: boolean;
  setShowNamesInApplet: (showNames: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showAdditionalDefinitionInformation: boolean;
  setShowAdditionalDefinitionInformation: (showAdditionalDefinitionInformation: boolean) => void;
};

export const useGlobalUIStore = create<GlobalUIStore>((set) => ({
  isDesktop: false,
  setIsDesktop: (isDesktop) => set({ isDesktop }),
  uiInFocus: null,
  setUiInFocus: (uiInFocus) => {
    if (uiInFocus === 'help') 0; // don't change the hash state
    else if (uiInFocus !== 'applet') window.location.hash = `${useAppState.getState().base64InputStateString ?? ''}`;
    else
      window.location.hash = `${useAppState.getState().base64InputStateString ?? ''}/${
        useAppState.getState().base64AppletStateString ?? ''
      }`;
    set({ uiInFocus });
  },
  showNamesInApplet: false,
  setShowNamesInApplet: (showNamesInApplet) => set({ showNamesInApplet }),
  loading: true,
  setLoading: (loading) => set({ loading }),
  showAdditionalDefinitionInformation: true,
  setShowAdditionalDefinitionInformation: (showAdditionalDefinitionInformation) =>
    set({ showAdditionalDefinitionInformation })
}));
