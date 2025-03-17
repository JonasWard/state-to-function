import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { parserObjects } from './modelDefinition/model';
import React from 'react';
import { useAppletData } from './state/applet';
import { getAppletVersionHandler } from './modelDefinition/appletModel';
import { VersionODataType } from './modelDefinition/types/version0.data.type';
import { useMethodData } from './state/method';
import { createMethod } from './lib/methodCreator';
import { VersionAppletDataType } from './modelDefinition/types/versionApplet.data.type';
import { AttributeNames } from './modelDefinition/enums/attributeNames';
import { NumericInputs } from './AppletComponents/NumericInputs';
import { NumericOutputs } from './AppletComponents/NumericOutputs';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const getValuesFromAppletState = (data: VersionAppletDataType) =>
  Object.entries(data)
    .filter(([a]) => a !== AttributeNames.Version)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map(([, v]) => v[AttributeNames.NumericInputValue].value);

export const Applet: React.FC = () => {
  const { methodStateString, inputStateString } = useParams();
  const [outputData, setOutputData] = useState<{ [id: string]: number }>({});

  const data = useAppletData((s) => s.data);
  const versionHandler = useAppletData((s) => s.versionHandler);

  const navigate = useNavigate();

  useEffect(() => {
    if (methodStateString) {
      try {
        const methodStateData = parserObjects.parser(methodStateString);
        useMethodData.getState().setData(methodStateData);
        const versionHandler = getAppletVersionHandler(methodStateData as VersionODataType);
        useAppletData.getState().setVersionHandler(versionHandler);
        try {
          useAppletData.getState().setData(versionHandler.parser(inputStateString));
        } catch (e) {
          console.error('issue with the inputState, trying with default state');
          console.error(e);
          try {
            useAppletData.getState().setData(versionHandler.parser());
          } catch (e) {
            console.error("issue with the inputState, can't do anything with this");
            console.error(e);
          }
        }
      } catch (e) {
        console.error("issue with the methodState, can't do anything with this");
        console.error(e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (versionHandler) {
      window.history.replaceState(null, 'Same Page Title', `/state-to-function/#${methodStateString}/${versionHandler.stringify(data)}`);
      setOutputData(createMethod(useMethodData.getState().data as VersionODataType)(getValuesFromAppletState(data)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, versionHandler]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 800, alignItems: 'center' }}>
        <Button style={{ margin: 16, width: 150 }} onClick={() => navigate(`/${methodStateString}`, { replace: true })}>
          <ArrowLeftOutlined /> Edit method
        </Button>
        <div style={{ padding: 10, display: 'grid', gridTemplateColumns: 'auto auto 1fr auto', gap: 8, width: '100%', margin: 'auto', alignItems: 'center' }}>
          <NumericInputs />
          <NumericOutputs values={outputData} />
        </div>
      </div>
    </div>
  );
};
