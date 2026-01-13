import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  DataEntry,
  FromState,
  getStateData,
  GetStateNodeTree,
  ObjectNode,
  SpecificTypeNode,
  VersionDataEntry
} from 'url-safe-bitpacking';
import { ModelStateDescriptor } from '../modelDefinition/newModel';
import { INITIAL_INPUT_VIEW_STRING, ROOT_NODE_NAME } from '../state/c';
import { evalMethod } from './getMethod';
import { MethodStateData } from './methodDataType';
import { getStateDataForNumericInputs } from './utils';
import { SpecificNodeUI } from '../specificInputs/SpecificNodeUI';
import { IconRenderer } from '../Components/renderers/icon/IconRenderer';

/**
 * Helper method that tries to parse the provided base string, if it fails, falls back to the default string (surface volume and surface area of a box)
 * @param base64string
 */
const getStateNodeForDataString = (
  stateModelDescriptor: DataEntry[],
  base64string: string | undefined
): SpecificTypeNode => {
  if (!base64string)
    return GetStateNodeTree(stateModelDescriptor as [VersionDataEntry, ...DataEntry[]], ROOT_NODE_NAME);
  try {
    return FromState(stateModelDescriptor as [VersionDataEntry, ...DataEntry[]], ROOT_NODE_NAME, base64string);
  } catch (e) {
    console.error(e);
    return GetStateNodeTree(stateModelDescriptor as [VersionDataEntry, ...DataEntry[]], ROOT_NODE_NAME);
  }
};

export const Applet = () => {
  const { base64MethodStateString, base64InputStateString } = useParams();

  const methodStateData = useMemo(
    () =>
      getStateData(
        FromState(
          ModelStateDescriptor,
          ROOT_NODE_NAME,
          base64MethodStateString || INITIAL_INPUT_VIEW_STRING
        ).toDataEntry()
      ) as MethodStateData,
    [base64MethodStateString]
  );
  const { dataEntries, indexMapping } = useMemo(
    () => getStateDataForNumericInputs(methodStateData.inputValues),
    [methodStateData.inputValues]
  );

  const stateNode = useRef(getStateNodeForDataString(dataEntries, base64InputStateString) as ObjectNode);

  const [rerenders, forceRender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const base64String = stateNode.current.getBase64String();
    window.location.hash = `${base64MethodStateString}/${base64String}`;
  }, [rerenders]);

  const variableValues = useMemo(
    () =>
      Object.fromEntries(
        Object.values(getStateData(stateNode.current.toDataEntry()) as Record<number, number>).map((v, i) => [
          indexMapping[i],
          v
        ])
      ),
    [indexMapping, stateNode.current.bitstring]
  );

  const currentResult = useMemo(() => evalMethod(methodStateData, variableValues), [methodStateData, variableValues]);

  return (
    <div style={{ width: '100svw', padding: 8 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 8,
          maxWidth: 300,
          width: '100%',
          margin: '0 auto',
          alignItems: 'center'
        }}
      >
        {stateNode.current.getChildren()!.map((c, i) => (
          <>
            <IconRenderer
              key={`n${i}`}
              symbol={methodStateData.inputValues[indexMapping[i]].symbol}
              subscript={methodStateData.inputValues[indexMapping[i]].subscript}
            />
            <SpecificNodeUI key={`n-i${i}`} node={c!} forceRender={forceRender} />
          </>
        ))}
        {currentResult.map((c, i) => (
          <>
            <IconRenderer
              key={`m${i}`}
              symbol={methodStateData.methodValues[i].symbol}
              subscript={methodStateData.methodValues[i].subscript}
            />
            <var style={{ fontSize: '1.1rem', fontWeight: 'medium' }} key={`m-${i}`}>
              {c}
            </var>
          </>
        ))}
      </div>
    </div>
  );
};
