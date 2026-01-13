import { useEffect, useReducer, useRef } from 'react';
import { ModelStateDescriptor } from './modelDefinition/newModel';
import React from 'react';
import { FromState, ObjectNode, SpecificTypeNode } from 'url-safe-bitpacking';
import { useParams } from 'react-router-dom';
import { ROOT_NODE_NAME, INITIAL_INPUT_VIEW_STRING, MIN_DESKTOP_WIDTH } from './state/c';
import { InputMethodsComponent } from './specificInputs/InputMethodsComponent';
import { useGlobalUIStore } from './state/globalUIStore';

/**
 * Helper method that tries to parse the provided base string, if it fails, falls back to the default string (surface volume and surface area of a box)
 * @param base64string
 */
const getStateNodeForDataString = (base64string: string | undefined): SpecificTypeNode => {
  try {
    return FromState(ModelStateDescriptor, ROOT_NODE_NAME, base64string || INITIAL_INPUT_VIEW_STRING);
  } catch (e) {
    console.error(e);
    return FromState(ModelStateDescriptor, ROOT_NODE_NAME, INITIAL_INPUT_VIEW_STRING);
  }
};

export const InputView: React.FC = () => {
  const { base64MethodStateString } = useParams();
  const { setIsDesktop } = useGlobalUIStore();
  const stateNode = useRef(getStateNodeForDataString(base64MethodStateString));

  const [rerenders, forceRender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const base64String = stateNode.current.getBase64String();
    window.location.hash = base64String;
  }, [rerenders]);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth > MIN_DESKTOP_WIDTH;
      setIsDesktop(isDesktop);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ width: '100svw', overflow: 'clip' }}>
      <InputMethodsComponent node={stateNode.current as ObjectNode} forceRender={forceRender} />
    </div>
  );
};
