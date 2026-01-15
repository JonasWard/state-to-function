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

export const App: React.FC = () => {
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
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

    setHasInitialLoad(true);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { uiInFocus } = useGlobalUIStore();

  return <Navigation>{hasInitialLoad ? uiInFocus === 'applet' ? <Applet /> : <InputView /> : null}</Navigation>;
};
