import React, { useEffect, useState } from 'react';
import './App.css';
import { parserObjects } from './modelDefinition/model';
import { useMethodData } from './state/method';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, message, Tooltip } from 'antd';
import { MethodComposer } from './Components/renderers/MethodComposer';
import { EditNumericInputsEditor } from './Components/inputs/InputValuesEditor';
import { MethodEntry, VersionODataType } from './modelDefinition/types/version0.data.type';
import { AttributeNames } from './modelDefinition/enums/attributeNames';
import { EditMethodRenderer } from './Components/inputs/EditMethodRenderer';
import { ArrowRightOutlined, RedoOutlined, UndoOutlined } from '@ant-design/icons';

const defaultState =
  'BEgCaAAYCQFbzWlD-lsL2gUVbkrwwRCIRYiQhAIIBALQADAdArea0of0Arc0segment0of0circleDARCSAADuIDiameterASAJIAwAI0KKty6Z96t6dx4YIhEIsRJA0IBBAIBAAigK3NJXp4LYQwEQg0Rq2nYrrAD0oQ0K1PBK8GAiEehIIwBXZm3nL1rNuABeo8NQAL0JA';

const isDesktopView = () => window.innerWidth > 1400;
const isSmallerThan800 = () => window.innerWidth < 800;

export const MethodComposerApp: React.FC = () => {
  const { methodStateString } = useParams();

  const [localMethodStateString, setLocalMethodStateString] = useState(methodStateString);
  const [methodToEdit, setMethodToEdit] = useState<MethodEntry | undefined>(undefined);
  const [desktop, setDesktop] = useState<boolean>(isDesktopView());
  const [smallerThan800, setIsSmallerThan800] = useState<boolean>(isSmallerThan800());

  const data = useMethodData((s) => s.data) as VersionODataType;
  const canUndo = useMethodData((s) => s.canUndo);
  const canRedo = useMethodData((s) => s.canRedo);
  const undoStack = useMethodData((s) => s.undoStack);
  const redoStack = useMethodData((s) => s.redoStack);

  const navigate = useNavigate();

  useEffect(() => {
    const parsedString = parserObjects.stringify(data);
    setLocalMethodStateString(parsedString);
    if (parsedString !== methodStateString) window.history.replaceState(null, 'Same Page Title', `/state-to-function/#${parsedString}`);
  }, [data, methodStateString]);

  useEffect(() => {
    const checkViewMode = () => {
      setDesktop(isDesktopView());
      setIsSmallerThan800(isSmallerThan800());
    };

    const registerKeyboardUndoRedo = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
        e.preventDefault();
        if (e.metaKey && e.shiftKey) useMethodData.getState().redo();
        else useMethodData.getState().undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyY') {
        e.preventDefault();
        useMethodData.getState().redo();
      }
    };

    addEventListener('resize', checkViewMode);
    addEventListener('keydown', registerKeyboardUndoRedo);

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

    return () => {
      removeEventListener('resize', checkViewMode);
      removeEventListener('keydown', registerKeyboardUndoRedo);
    };
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

  return desktop ? (
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
          <span style={{ padding: '0 10px', display: 'flex', flexDirection: 'row', gap: 6 }}>
            <Tooltip title={`can undo ${undoStack.length} items`}>
              <Button disabled={!canUndo} onClick={() => useMethodData.getState().undo()}>
                Undo <UndoOutlined />
              </Button>
            </Tooltip>
            <Tooltip title={`can redo ${redoStack.length} items`}>
              <Button disabled={!canRedo} onClick={() => useMethodData.getState().redo()}>
                <RedoOutlined /> Redo
              </Button>
            </Tooltip>
            <Button style={{ width: 140 }} onClick={() => navigate(`/${localMethodStateString}/s`, { replace: true })}>
              Try method <ArrowRightOutlined />
            </Button>
          </span>
          <MethodComposer setMethodToEdit={wrapperSetMethodToEdit} />
        </div>
        <EditMethodRenderer method={methodToEdit} clearMethod={clearMethod} desktop={desktop} />
      </div>
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        borderColor: 'lightgray',
        borderStyle: desktop ? 'none solid' : 'none',
        alignItems: 'center',
        padding: 18,
      }}
    >
      <Button style={{ width: 140 }} onClick={() => navigate(`/${localMethodStateString}/s`, { replace: true })}>
        Try method <ArrowRightOutlined />
      </Button>
      <span style={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
        <Tooltip title={`can undo ${undoStack.length} items`}>
          <Button disabled={!canUndo} onClick={() => useMethodData.getState().undo()}>
            Undo <UndoOutlined />
          </Button>
        </Tooltip>
        <Tooltip title={`can redo ${redoStack.length} items`}>
          <Button disabled={!canRedo} onClick={() => useMethodData.getState().redo()}>
            <RedoOutlined /> Redo
          </Button>
        </Tooltip>
      </span>
      <EditNumericInputsEditor numericInputs={data[AttributeNames.NumericInputs]} desktop={desktop} />

      <MethodComposer setMethodToEdit={wrapperSetMethodToEdit} smallerThan800={smallerThan800} />
      <EditMethodRenderer method={methodToEdit} clearMethod={clearMethod} desktop={desktop} />
    </div>
  );
};
