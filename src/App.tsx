import React, { useEffect, useRef } from 'react';
import './App.css';
import { parserObjects } from './modelDefinition/model';
import { ParametricInput } from './Components/parametrics/ParametricInput';
import { useData } from './state/state';
import { useParams } from 'react-router-dom';
import { Button, Drawer, message } from 'antd';
import { version0EnumSemantics } from './modelDefinition/types/version0.enumsemantics';
import { SaveOutlined } from '@ant-design/icons';
import { StateDataRenderer } from './Components/renderers/StateDataRenderer';

const defaultState = 'BMQARQAwAAA0AAAAYA';

export const App: React.FC = () => {
  const { stateString } = useParams();
  const data = useData((s) => s.data);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    window.history.replaceState(null, 'Same Page Title', `/state-to-function/#${parserObjects.stringify(data)}`);
  }, [data]);

  useEffect(() => {
    if (stateString) {
      try {
        useData.getState().setData(parserObjects.parser(stateString));
      } catch (e) {
        try {
          useData.getState().setData(parserObjects.parser(defaultState));
          message.warning('the state string you tried to use was not valid, using the default state instead');
        } catch (e) {
          useData.getState().setData(parserObjects.parser());
          message.error('the default!! state string was not valid, using the default object state instead');
        }
      }
    } else {
      try {
        useData.getState().setData(parserObjects.parser(defaultState));
      } catch (e) {
        useData.getState().setData(parserObjects.parser());
        message.error('the default!! state string was not valid, using the default object state instead');
      }
    }
  }, []);

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `state-to-function.${parserObjects.stringify(data)}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <>
      <StateDataRenderer />
      <Drawer open mask={false}>
        <ParametricInput versionEnumSemantics={version0EnumSemantics} />
        {localStorage.getItem('iAmJonas') === 'true' ? (
          <Button style={{ position: 'fixed', top: '15px', right: '15px' }} onClick={downloadPNG}>
            <SaveOutlined style={{ position: 'absolute', width: 20, height: 20 }} size={16} />
          </Button>
        ) : null}
      </Drawer>
    </>
  );
};
