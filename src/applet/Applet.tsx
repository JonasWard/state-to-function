import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import { getStateData, ObjectNode } from 'url-safe-bitpacking';
import { evalMethod } from './getMethod';
import { getMethodStateData, getStateDataForNumericInputs, getStateNodeForDataString } from './utils';
import { SpecificNodeUI } from '../method/specificInputs/SpecificNodeUI';
import { IconRenderer } from '../Components/icon/IconRenderer';
import { useAppState } from '../state/appState';
import { Descriptions } from 'antd';
import { useGlobalUIStore } from '../state/globalUIStore';
import { PDFDownloadButton } from '../Components/pdf/PDFDownloadButton';
import { usePDFData } from '../Components/pdf/usePDFData';
import './applet.css';
import { CSVDownloadButton } from './CSVDownloadButton';

export const Applet: React.FC = () => {
  const base64InputStateString = useAppState((s) => s.base64InputStateString!);
  const base64AppletStateString = useAppState((s) => s.base64AppletStateString);
  const isDesktop = useGlobalUIStore((s) => s.isDesktop);
  const showNamesInApplet = useGlobalUIStore((s) => s.showNamesInApplet);

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
  const children = useMemo(
    () => stateNode.current.getChildren(),
    [stateNode.current.name, stateNode.current.bitstring]
  );

  const { inputValues, resultValues } = usePDFData({
    methodStateData,
    indexMapping,
    stateNode: stateNode.current,
    currentResult
  });

  return (
    <div style={{ maxWidth: 'min(100svw - 2rem, 800px)', margin: '0 auto' }}>
      <Descriptions
        style={{ margin: '1rem 0' }}
        size="small"
        bordered
        colon={false}
        items={children.map((c, key) => ({
          key,
          label: (
            <>
              <IconRenderer
                key={`n${key}`}
                symbol={methodStateData.inputValues[indexMapping[key]].symbol}
                subscript={methodStateData.inputValues[indexMapping[key]].subscript}
                size="1.3rem"
              />
            </>
          ),
          children: (
            <div
              className="applet-nested-result-content"
              style={{
                gridTemplateColumns:
                  isDesktop && showNamesInApplet && methodStateData.inputValues[indexMapping[key]].name
                    ? '1fr auto'
                    : '1fr'
              }}
            >
              <SpecificNodeUI key={`n-i${key}`} node={c!} forceRender={forceRender} />
              {showNamesInApplet && methodStateData.inputValues[indexMapping[key]].name ? (
                <var style={{ fontSize: '.9rem', fontWeight: 'normal', margin: '0 8px' }} key={`n-${key}`}>
                  {methodStateData.inputValues[indexMapping[key]].name}
                </var>
              ) : null}
            </div>
          )
        }))}
      />
      <Descriptions
        style={{ margin: '1rem 0' }}
        bordered
        size="small"
        title="Results"
        colon={false}
        column={isDesktop ? undefined : 2}
        items={currentResult.map((c, key) => ({
          key,
          label: (
            <IconRenderer
              key={`m${key}`}
              symbol={methodStateData.methodValues[key].symbol}
              subscript={methodStateData.methodValues[key].subscript}
              size="1.3rem"
            />
          ),
          children: (
            <div
              className="applet-nested-result-content"
              style={{
                gridTemplateColumns:
                  isDesktop && showNamesInApplet && methodStateData.methodValues[key].name ? '1fr auto' : '1fr'
              }}
            >
              <var style={{ fontSize: '1.1rem', fontWeight: 'medium', margin: 'auto 0' }} key={`m-${key}`}>
                {c}
              </var>
              {showNamesInApplet && methodStateData.methodValues[key].name ? (
                <var style={{ fontSize: '.9rem', fontWeight: 'normal' }} key={`n-${key}`}>
                  {methodStateData.methodValues[key].name}
                </var>
              ) : null}
            </div>
          )
        }))}
      />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '1rem 0' }}>
        <PDFDownloadButton inputValues={inputValues} resultValues={resultValues} />
        <CSVDownloadButton inputValues={inputValues} resultValues={resultValues} />
      </div>
    </div>
  );
};
