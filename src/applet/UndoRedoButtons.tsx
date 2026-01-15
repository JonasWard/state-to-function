import { Button } from 'antd';
import React from 'react';
import { useAppState } from '../state/appState';
import { useGlobalUIStore } from '../state/globalUIStore';
import { RedoOutlined, UndoOutlined } from '@ant-design/icons';

export const UndoRedoButtons: React.FC = () => {
  const canUndoInput = useAppState((s) => s.canUndoInput);
  const canRedoInput = useAppState((s) => s.canRedoInput);
  const canUndoApplet = useAppState((s) => s.canUndoApplet);
  const canRedoApplet = useAppState((s) => s.canRedoApplet);
  const uiInFocus = useGlobalUIStore((s) => s.uiInFocus);

  return (
    <div>
      <Button
        type="text"
        disabled={!(uiInFocus === 'applet' ? canUndoApplet : canUndoInput)}
        onClick={() =>
          useGlobalUIStore.getState().uiInFocus === 'applet'
            ? useAppState.getState().undoAppletStateString()
            : useAppState.getState().undoInputStateString()
        }
      >
        <UndoOutlined />
      </Button>
      <Button
        type="text"
        disabled={!(uiInFocus === 'applet' ? canRedoApplet : canRedoInput)}
        onClick={() =>
          useGlobalUIStore.getState().uiInFocus === 'applet'
            ? useAppState.getState().redoAppletStateString()
            : useAppState.getState().redoInputStateString()
        }
      >
        <RedoOutlined />
      </Button>
    </div>
  );
};
