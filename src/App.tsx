import { useParams } from 'react-router-dom';
import { useAppState } from './state/appState';
import { useEffect, useState } from 'react';
import { Navigation } from './Components/Navigation';
import React from 'react';
import { useGlobalUIStore } from './state/globalUIStore';
import { Applet } from './applet/Applet';
import { InputView } from './method/InputView';
import { FromState, getStateData, ObjectNode } from 'url-safe-bitpacking';
import { INITIAL_INPUT_VIEW_STRING, MIN_DESKTOP_WIDTH, ROOT_NODE_NAME } from './state/c';
import { ModelStateDescriptor } from './modelDefinition/newModel';
import { getStateDataForNumericInputs, getStateNodeForDataString } from './applet/utils';
import { MethodStateData } from './applet/methodDataType';

const handleUndoRedo = (e: KeyboardEvent) => {
  let undoRedoNothing: 'undo' | 'redo' | undefined = undefined;

  if (e.metaKey || e.ctrlKey) {
    if (e.key === 'z') undoRedoNothing = e.shiftKey ? 'redo' : 'undo';
    else if (e.key === 'y') undoRedoNothing = 'redo';
  }

  if (!undoRedoNothing) return;

  const uiInFocus = useGlobalUIStore.getState().uiInFocus;
  console.log(undoRedoNothing, uiInFocus);
  if (uiInFocus === 'applet' && undoRedoNothing === 'undo')
    useAppState.getState().undoAppletStateString(), e.preventDefault();
  if (uiInFocus === 'applet' && undoRedoNothing === 'redo')
    useAppState.getState().redoAppletStateString(), e.preventDefault();
  if (uiInFocus !== 'applet' && undoRedoNothing === 'undo')
    useAppState.getState().undoInputStateString(), e.preventDefault();
  if (uiInFocus !== 'applet' && undoRedoNothing === 'redo')
    useAppState.getState().redoInputStateString(), e.preventDefault();
};

export const App: React.FC = () => {
  const loading = useGlobalUIStore((s) => s.loading);
  const setLoading = useGlobalUIStore((s) => s.setLoading);
  const { base64InputStateString, base64AppletStateString } = useParams();

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth > MIN_DESKTOP_WIDTH;
      useGlobalUIStore.getState().setIsDesktop(isDesktop);
      return isDesktop;
    };

    const isDesktop = handleResize();

    if (base64InputStateString) {
      try {
        // validating the base64 strings used for the mehod
        const state = FromState(ModelStateDescriptor, ROOT_NODE_NAME, base64InputStateString);
        useAppState.getState().addInputStateStringToStack(base64InputStateString);
        if (base64AppletStateString) {
          try {
            // based on the current method state, we can validate the input state string
            const methodStateData = getStateData(state.toDataEntry()) as MethodStateData;
            const { dataEntries } = getStateDataForNumericInputs(methodStateData.inputValues);
            useAppState
              .getState()
              .addAppletStateStringToStack(
                (getStateNodeForDataString(dataEntries, base64AppletStateString) as ObjectNode).getBase64String()
              );
            useGlobalUIStore.getState().setUiInFocus('applet');
          } catch (e) {
            console.error(e);
            // use the default state string
            useAppState.getState().addAppletStateStringToStack(INITIAL_INPUT_VIEW_STRING);
            useGlobalUIStore.getState().setUiInFocus(isDesktop ? 'method' : null);
          }
        } else useGlobalUIStore.getState().setUiInFocus(isDesktop ? 'method' : null);
      } catch (e) {
        console.error(e);
        // use the default state string
        useAppState.getState().addInputStateStringToStack(INITIAL_INPUT_VIEW_STRING);
        useGlobalUIStore.getState().setUiInFocus(isDesktop ? 'method' : null);
      }
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleUndoRedo);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleUndoRedo);
    };
  }, []);

  useEffect(() => {
    if (loading) setLoading(false);
  }, [loading]);

  const { uiInFocus } = useGlobalUIStore();

  return <Navigation>{loading ? null : uiInFocus === 'applet' ? <Applet /> : <InputView />}</Navigation>;
};
