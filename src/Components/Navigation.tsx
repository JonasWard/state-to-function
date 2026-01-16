import React from 'react';
import { useGlobalUIStore } from '../state/globalUIStore';
import { Segmented } from 'antd';
import type { SegmentedOptions } from 'antd/es/segmented';
import './navigation.css';
import { UndoRedoButtons } from '../applet/UndoRedoButtons';
import { SettingsComponent } from './settings/Settings';

const NavigationComponent: React.FC = () => {
  const { uiInFocus, setUiInFocus, isDesktop } = useGlobalUIStore();

  const desktopOptions: SegmentedOptions = [
    { label: 'Definitions', value: 'null' },
    { label: 'Applet', value: 'applet' }
  ];

  const mobileOptions: SegmentedOptions = [
    { label: 'Inputs', value: 'numeric' },
    { label: 'Methods', value: 'method' },
    { label: 'Applet', value: 'applet' }
  ];

  const options = isDesktop ? desktopOptions : mobileOptions;
  const currentValue = uiInFocus === null ? 'null' : uiInFocus;

  const handleChange = (value: string | number) =>
    setUiInFocus(value === 'null' ? null : (value as 'method' | 'numeric' | 'applet'));

  return (
    <header className="navigation-header">
      <Segmented options={options} value={currentValue} onChange={handleChange} size="small" />
      <div style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
        <UndoRedoButtons />
        <SettingsComponent />
      </div>
    </header>
  );
};

export const Navigation: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="navigation-wrapper">
    <NavigationComponent />
    {children}
  </div>
);
