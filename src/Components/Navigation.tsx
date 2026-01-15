import React from 'react';
import { useGlobalUIStore } from '../state/globalUIStore';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './navigation.css';

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
          {uiInFocus === 'method' ? 'Numeric Inputs' : 'Method Inputs'}
        </Button>
      ) : null}
      <Button
        type="text"
        onClick={() => setUiInFocus(uiInFocus === 'applet' ? (isDesktop ? null : 'method') : 'applet')}
        className="arrow-button"
      >
        <ArrowLeftOutlined className={`arrow-icon ${uiInFocus === 'applet' ? 'left' : 'right'}`} />
        {uiInFocus === 'applet' ? 'Inputs' : 'Applet'}
      </Button>
    </div>
  );
};

export const Navigation: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="navigation-wrapper">
    <NavigationComponent />
    {children}
  </div>
);
