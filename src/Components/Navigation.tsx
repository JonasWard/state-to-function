import React from 'react';
import { useGlobalUIStore } from '../state/globalUIStore';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './navigation.css';
import { UndoRedoButtons } from '../applet/UndoRedoButtons';

const NavigationComponent: React.FC = () => {
  const { uiInFocus, setUiInFocus, isDesktop } = useGlobalUIStore();

  return (
    <div className="navigation-component">
      {!isDesktop && uiInFocus !== 'applet' ? (
        <Button
          type="text"
          onClick={() => setUiInFocus(uiInFocus === 'method' ? 'numeric' : 'method')}
          className="arrow-button"
        >
          <ArrowLeftOutlined className={`arrow-icon ${uiInFocus === 'method' ? 'left' : 'right'}`} />
          {uiInFocus === 'method' ? 'Input Definitions' : 'Method Definitions'}
        </Button>
      ) : null}
      <Button
        type="text"
        onClick={() => setUiInFocus(uiInFocus === 'applet' ? (isDesktop ? null : 'method') : 'applet')}
        className="arrow-button"
      >
        <ArrowLeftOutlined className={`arrow-icon ${uiInFocus === 'applet' ? 'left' : 'right'}`} />
        {uiInFocus === 'applet' ? 'Definitions' : 'Applet'}
      </Button>
      <UndoRedoButtons />
    </div>
  );
};

export const Navigation: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="navigation-wrapper">
    <NavigationComponent />
    {children}
  </div>
);
