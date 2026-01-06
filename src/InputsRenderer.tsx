import { useEffect, useReducer, useRef } from 'react';
import { ModelStateDescriptor } from './modelDefinition/newModel';
import React from 'react';
import { FromState, getStateData, GetStateNodeTree, StateDataObjectValue } from 'url-safe-bitpacking';
import { SpecificNodeUI } from './specificInputs/SpecificNodeUI';
import { useMethodStore } from './state/methodStore';
import { LispStyle } from './Components/renderers/method/LispStyle';
import { MethodFlatRenderer } from './Components/renderers/method/MethodFlatRenderer';
import { useParams } from 'react-router-dom';

export const ROOT_NODE_NAME = 'ROOT_NODE';
const initialString = 'ABJQAoAfSCcQ-hIDYAUAPpBOIfQkCEAKAH0gnEPoSAoAKYCECEAEUBCFEACkAhAiAAARgwIMICRUACICI';

const getStateDataString = (stateData: StateDataObjectValue): [number, string][] =>
  JSON.stringify(stateData, null, 2)
    .split('\n')
    .map((s) => {
      const trailingSpaces = s.match(/^\s*/)?.[0]?.length || 0;
      return [trailingSpaces, s];
    });

export const ModelCheck: React.FC = () => {
  const { base64String } = useParams();
  const { numericInputNames, methodInputNames, method, methodIndex } = useMethodStore();
  const stateNode = useRef(FromState(ModelStateDescriptor, ROOT_NODE_NAME, base64String || initialString));

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
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 420, wordBreak: 'break-all' }}>
          {stateNode.current.getBase64String()}
          {getStateDataString(getStateData(stateNode.current.toDataEntry())).map(([trailingSpaces, line], i) => (
            <span key={i} style={{ paddingLeft: trailingSpaces * 8 }}>
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
