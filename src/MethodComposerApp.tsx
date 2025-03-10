import React, { useEffect } from 'react';
import './App.css';
import { parserObjects } from './modelDefinition/model';
import { useMethodData } from './state/method';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { MethodComposer } from './Components/renderers/MethodComposer';

const defaultState = 'A1ABAABAK3mgSGgACUACksAASwASGAIA4AAIxyNGptD4hnZm3m3z0JAoYxRdo1W9oa9NQIaIYcehIA';

export const MethodComposerApp: React.FC = () => {
  const { methodStateString } = useParams();

  const data = useMethodData((s) => s.data);

  useEffect(() => {
    const parsedString = parserObjects.stringify(data);
    if (parsedString !== methodStateString) window.history.replaceState(null, 'Same Page Title', `/state-to-function/#${parserObjects.stringify(data)}`);
  }, [data]);

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

  return <MethodComposer />;
};
