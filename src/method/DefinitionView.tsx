import { Grid } from 'antd';
import React from 'react';
import { useUIStore } from '../state/uiStore';
import styles from './definitions.module.css';
import { InputsPanel } from './inputs/InputsPanel';
import { MethodsPanel } from './methods/MethodsPanel';

/** Inputs and methods side by side; on small screens the header switches between them. */
export const DefinitionView: React.FC = () => {
  const wide = Grid.useBreakpoint().lg ?? true;
  const pane = useUIStore((s) => s.mobilePane);
  if (wide)
    return (
      <div className={styles.view}>
        <InputsPanel />
        <MethodsPanel />
      </div>
    );
  return <div className={`${styles.view} ${styles.single}`}>{pane === 'inputs' ? <InputsPanel /> : <MethodsPanel />}</div>;
};
