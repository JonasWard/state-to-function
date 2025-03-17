import React, { useEffect, useState } from 'react';
import './App.css';
import { parserObjects } from './modelDefinition/model';
import { useMethodData } from './state/method';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, message } from 'antd';
import { MethodComposer } from './Components/renderers/MethodComposer';
import { EditNumericInputsEditor } from './Components/inputs/InputValuesEditor';
import { MethodEntry, VersionODataType } from './modelDefinition/types/version0.data.type';
import { AttributeNames } from './modelDefinition/enums/attributeNames';
import { EditMethodRenderer } from './Components/inputs/EditMethodRenderer';
import { ArrowRightOutlined } from '@ant-design/icons';

const defaultState =
  'BEgCaAAYCQFbzWlD-lsL2gUVbkrwwRCIRYiQhAIIBALQADAdArea0of0Arc0segment0of0circleDARCSAADuIDiameterASAJIAwAI0KKty6Z96t6dx4YIhEIsRJA0IBBAIBAAigK3NJXp4LYQwEQg0Rq2nYrrAD0oQ0K1PBK8GAiEehIIwBXZm3nL1rNuABeo8NQAL0JA';

export const MethodComposerApp: React.FC<{ desktop?: boolean }> = ({ desktop }) => {
  const { methodStateString } = useParams();

  const [localMethodStateString, setLocalMethodStateString] = useState(methodStateString);
  const [methodToEdit, setMethodToEdit] = useState<MethodEntry | undefined>(undefined);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearMethod = () => setMethodToEdit(undefined);
  const wrapperSetMethodToEdit = (newMethod: MethodEntry) =>
    JSON.stringify(methodToEdit) === JSON.stringify(newMethod) ? clearMethod() : setMethodToEdit(newMethod);

  useEffect(() => {
    if (methodToEdit)
      setMethodToEdit(
        data[AttributeNames.FunctionArray].v.find(
          (m) =>
            m[AttributeNames.Function][AttributeNames.InputValue].s.internalName! ===
            methodToEdit[AttributeNames.Function][AttributeNames.InputValue].s.internalName!
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setMethodToEdit]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 4, padding: 18 }}>
        <EditNumericInputsEditor numericInputs={data[AttributeNames.NumericInputs]} desktop={desktop} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            borderColor: 'lightgray',
            borderStyle: desktop ? 'none solid' : 'none',
            alignItems: 'center',
          }}
        >
          <Button style={{ width: 140 }} onClick={() => navigate(`/${localMethodStateString}/s`, { replace: true })}>
            Try method <ArrowRightOutlined />
          </Button>
          <MethodComposer setMethodToEdit={wrapperSetMethodToEdit} />
        </div>
        <EditMethodRenderer method={methodToEdit} clearMethod={clearMethod} desktop={desktop} />
      </div>
    </div>
  );
};
