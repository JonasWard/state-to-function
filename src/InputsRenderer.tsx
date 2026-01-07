import { useEffect, useReducer, useRef } from 'react';
import { ModelStateDescriptor } from './modelDefinition/newModel';
import React from 'react';
import { FromState, SpecificTypeNode } from 'url-safe-bitpacking';
import { SpecificNodeUI } from './specificInputs/SpecificNodeUI';
import { useMethodStore } from './state/methodStore';
import { LispStyle } from './Components/renderers/method/LispStyle';
import { MethodFlatRenderer } from './Components/renderers/method/MethodFlatRenderer';
import { useParams } from 'react-router-dom';
import { RenderStateNodeData } from './Components/renderers/state/RenderStateNodeData';

export const ROOT_NODE_NAME = 'ROOT_NODE';
const initialString = 'ABJQAoAfSCcQ-hIDYAUAPpBOIfQkCEAKAH0gnEPoSAoAKYCECEAEUBCFEACkAhAiAAARgwIMICRUACICI';

/**
 * Helper method that tries to parse the provided base string, if it fails, falls back to the default string (surface volume and surface area of a box)
 * @param base64string
 */
const getStateNodeForDataString = (base64string: string | undefined): SpecificTypeNode => {
  try {
    return FromState(ModelStateDescriptor, ROOT_NODE_NAME, base64string || initialString);
  } catch (e) {
    console.error(e);
    return FromState(ModelStateDescriptor, ROOT_NODE_NAME, initialString);
  }
};

export const ModelCheck: React.FC = () => {
  const { base64String } = useParams();
  const { numericInputNames, methodInputNames, method, methodIndex } = useMethodStore();
  const stateNode = useRef(getStateNodeForDataString(base64String));

  const [rerenders, forceRender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const base64String = stateNode.current.getBase64String();
    window.location.hash = base64String;
  }, [rerenders]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', padding: 4, gap: 4 }}>
      <div style={{ minWidth: 500, maxWidth: 500 }}>
        <SpecificNodeUI node={stateNode.current} forceRender={forceRender} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {method && (
          <LispStyle
            node={method}
            forceRender={forceRender}
            availableNumericInputs={numericInputNames}
            availableMethodInputs={methodInputNames.slice(0, methodIndex)}
          />
        )}
        {method && (
          <MethodFlatRenderer
            node={method}
            forceRender={forceRender}
            availableNumericInputs={numericInputNames}
            availableMethodInputs={methodInputNames.slice(0, methodIndex)}
          />
        )}
        <RenderStateNodeData node={stateNode.current} />
      </div>
    </div>
  );
};
