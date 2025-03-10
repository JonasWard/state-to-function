import React, { useEffect } from 'react';
import './App.css';
import { parserObjects } from './modelDefinition/model';
import { useData } from './state/state';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { StateDataRenderer } from './Components/renderers/StateDataRenderer';
import { InputComponent } from './Components/inputs/InputComponent';

const defaultState = 'BQaALWAgSkBggMBqCgCAqgDANTABbPShGYALh6jwdACbaPQkDIAL56EgtABhPQkFgATbZ6EgXACcfPQkA';

export const App: React.FC = () => {
  const { stateString } = useParams();

  const data = useData((s) => s.data);

  useEffect(() => {
    const parsedString = parserObjects.stringify(data);
    if (parsedString !== stateString) window.history.replaceState(null, 'Same Page Title', `/state-to-function/#${parserObjects.stringify(data)}`);
  }, [data]);

  useEffect(() => {
    if (stateString) {
      try {
        useData.getState().setData(parserObjects.parser(stateString + 'A'));
      } catch (e) {
        try {
          useData.getState().setData(parserObjects.parser(defaultState + 'A'));
          console.warn('the state string you tried to use was not valid, using the default state instead');
          console.warn(e);
          message.warning('the state string you tried to use was not valid, using the default state instead');
        } catch (e) {
          useData.getState().setData(parserObjects.parser());
          console.warn('the default!! state string was not valid, using the default object state instead');
          console.warn(e);
          message.error('the default!! state string was not valid, using the default object state instead');
        }
      }
    } else {
      try {
        useData.getState().setData(parserObjects.parser(defaultState));
      } catch (e) {
        useData.getState().setData(parserObjects.parser());
        console.warn('the default!! state string was not valid, using the default object state instead');
        console.warn(e);
        message.error('the default!! state string was not valid, using the default object state instead');
      }
    }
  }, []);

  return (
    <>
      <InputComponent />
      <StateDataRenderer />
      {/* <UnspecialisedInput /> */}
    </>
  );
};
