import React from 'react';
import { useGlobalUIStore } from '../state/globalUIStore';
import { Segmented } from 'antd';
import type { SegmentedOptions } from 'antd/es/segmented';
import './navigation.css';
import { UndoRedoButtons } from '../applet/UndoRedoButtons';
import { SettingsComponent } from './settings/Settings';
import {
  QuestionOutlined,
  FormOutlined,
  CalculatorOutlined,
  NumberOutlined,
  FunctionOutlined
} from '@ant-design/icons';

const SegmentWithIcon: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => {
  const isDesktop = useGlobalUIStore((s) => s.isDesktop);
  return (
    <span style={{ display: 'flex', gap: 2, height: 28 }}>
      {icon} {isDesktop ? text : undefined}
    </span>
  );
};

const NavigationComponent: React.FC = () => {
  const { uiInFocus, setUiInFocus, isDesktop } = useGlobalUIStore();

  const desktopOptions: SegmentedOptions = [
    { label: <SegmentWithIcon icon={<QuestionOutlined />} text="Help" />, value: 'help' },
    { label: <SegmentWithIcon icon={<FormOutlined />} text="Definitions" />, value: 'null' },
    { label: <SegmentWithIcon icon={<CalculatorOutlined />} text="Applet" />, value: 'applet' }
  ];

  const mobileOptions: SegmentedOptions = [
    { label: <SegmentWithIcon icon={<QuestionOutlined />} text="Help" />, value: 'help' },
    { label: <SegmentWithIcon icon={<NumberOutlined />} text="Inputs" />, value: 'numeric' },
    { label: <SegmentWithIcon icon={<FunctionOutlined />} text="Methods" />, value: 'method' },
    { label: <SegmentWithIcon icon={<CalculatorOutlined />} text="Applet" />, value: 'applet' }
  ];

  const options = isDesktop ? desktopOptions : mobileOptions;
  const currentValue = uiInFocus === null ? 'null' : uiInFocus;

  const handleChange = (value: string | number) =>
    setUiInFocus(value === 'null' ? null : (value as 'method' | 'numeric' | 'applet'));

  return (
    <header className="navigation-header bar">
      <div className="navigation-header content">
        <Segmented options={options} value={currentValue} onChange={handleChange} />
        <div style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <UndoRedoButtons />
          <SettingsComponent />
        </div>
      </div>
    </header>
  );
};

export const Navigation: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="navigation-wrapper">
    <NavigationComponent />
    <div className="navigation-content">{children}</div>
  </div>
);
