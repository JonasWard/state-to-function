import React, { useEffect, useState } from 'react';
import './App.css';
import { parserObjects } from './modelDefinition/model';
import { useMethodData } from './state/method';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, message } from 'antd';
import { MethodComposer } from './Components/renderers/MethodComposer';
import { EditNumericInputsEditor } from './Components/inputs/InputValuesEditor';
import { VersionODataType } from './modelDefinition/types/version0.data.type';
import { AttributeNames } from './modelDefinition/enums/attributeNames';

const defaultState = 'A0gCaAAIAgFbzQwRCIRYiSAgAEEUBW5oW9PBbCMEQiEWIsAASwASGAIA4AAURkWnYrrBgiEQixD0oQoYxRdo1W9oa9NQIaIYdeo8Iy1WpbntKH9D4gL1rM';

export const MethodComposerApp: React.FC = () => {
  const { methodStateString } = useParams();

  const [localMethodStateString, setLocalMethodStateString] = useState(methodStateString);

  const data = useMethodData((s) => s.data) as VersionODataType;
  const navigate = useNavigate();

  useEffect(() => {
    const parsedString = parserObjects.stringify(data);
    const newMethodStateString = parserObjects.stringify(data);
    setLocalMethodStateString(newMethodStateString);
    if (parsedString !== methodStateString) window.history.replaceState(null, 'Same Page Title', `/state-to-function/#${methodStateString}`);
  }, [data, methodStateString]);

  useEffect(() => {
    if (methodStateString) {
      try {
        useMethodData.getState().setData(parserObjects.parser(methodStateString));
      } catch (e) {
        try {
          useMethodData.getState().setData(parserObjects.parser(defaultState));
          console.warn('the state string you tried to use was not valid, using the default state instead');
          console.warn(e);
          message.warning('the state string you tried to use was not valid, using the default state instead');
        } catch (e) {
          useMethodData.getState().setData(parserObjects.parser());
          console.warn('the default!! state string was not valid, using the default object state instead');
          console.warn(e);
          message.error('the default!! state string was not valid, using the default object state instead');
        }
      }
    } else {
      try {
        useMethodData.getState().setData(parserObjects.parser(defaultState));
      } catch (e) {
        useMethodData.getState().setData(parserObjects.parser());
        console.warn('the default!! state string was not valid, using the default object state instead');
        console.warn(e);
        message.error('the default!! state string was not valid, using the default object state instead');
      }
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1200, justifyItems: 'center' }}>
      <span style={{ display: 'flex', flexDirection: 'row', width: 200, gap: 8 }}>
        <EditNumericInputsEditor numericInputs={data[AttributeNames.NumericInputs]} />
        <Button style={{ margin: 'auto' }} onClick={() => navigate(`/${localMethodStateString}/s`, { replace: true })}>
          Try method
        </Button>
      </span>
      <MethodComposer />
    </div>
  );
};
