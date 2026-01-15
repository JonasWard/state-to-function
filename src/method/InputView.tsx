import { useEffect, useReducer, useRef } from 'react';
import { ModelStateDescriptor } from '../modelDefinition/newModel';
import React from 'react';
import { FromState, ObjectNode, SpecificTypeNode } from 'url-safe-bitpacking';
import { ROOT_NODE_NAME, INITIAL_INPUT_VIEW_STRING } from '../state/c';
import { InputMethodsComponent } from './specificInputs/InputMethodsComponent';
import { useAppState } from '../state/appState';

/**
 * Helper method that tries to parse the provided base string, if it fails, falls back to the default string (surface volume and surface area of a box)
 * @param base64string
 */
const getStateNodeForDataString = (base64string: string | undefined | null): SpecificTypeNode => {
  try {
    return FromState(ModelStateDescriptor, ROOT_NODE_NAME, base64string || INITIAL_INPUT_VIEW_STRING);
  } catch (e) {
    console.error(e);
    return FromState(ModelStateDescriptor, ROOT_NODE_NAME, INITIAL_INPUT_VIEW_STRING);
  }
};

export const InputView: React.FC = () => {
  const base64InputStateString = useAppState((s) => s.base64InputStateString);
  const stateNode = useRef(getStateNodeForDataString(base64InputStateString));

  const [rerenders, forceRender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const cBISS = stateNode.current.getBase64String();
    if (cBISS !== useAppState.getState().base64InputStateString)
      useAppState.getState().addInputStateStringToStack(cBISS);
  }, [rerenders]);

  return (
    <div style={{ width: '100svw', overflow: 'clip' }}>
      <InputMethodsComponent node={stateNode.current as ObjectNode} forceRender={forceRender} />
    </div>
  );
};
