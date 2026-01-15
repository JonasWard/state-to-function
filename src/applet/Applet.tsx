import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import { getStateData, ObjectNode } from 'url-safe-bitpacking';
import { evalMethod } from './getMethod';
import { getMethodStateData, getStateDataForNumericInputs, getStateNodeForDataString } from './utils';
import { SpecificNodeUI } from '../specificInputs/SpecificNodeUI';
import { IconRenderer } from '../Components/renderers/icon/IconRenderer';
import { useAppState } from '../state/appState';

export const Applet: React.FC = () => {
  const base64InputStateString = useAppState((s) => s.base64InputStateString!);
  const base64AppletStateString = useAppState((s) => s.base64AppletStateString);

  const methodStateData = useMemo(() => getMethodStateData(base64InputStateString!), [base64InputStateString]);
  const { dataEntries, indexMapping } = useMemo(
    () => getStateDataForNumericInputs(methodStateData.inputValues),
    [methodStateData.inputValues]
  );

  const stateNode = useRef(getStateNodeForDataString(dataEntries, base64AppletStateString) as ObjectNode);

  const [rerenders, forceRender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const aBISS = stateNode.current.getBase64String();
    if (useAppState.getState().base64AppletStateString !== aBISS)
      useAppState.getState().addAppletStateStringToStack(aBISS);
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
