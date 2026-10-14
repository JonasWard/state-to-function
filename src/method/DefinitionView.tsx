import React from 'react';
import { useUIStore } from '../state/uiStore';
import styles from './definitions.module.css';
import { InputsPanel } from './inputs/InputsPanel';
import { MethodsPanel } from './methods/MethodsPanel';
import { useMediaQuery, WIDE } from '../Components/ui/useMediaQuery';

/** Inputs and methods side by side; on small screens the header switches between them. */
export const DefinitionView: React.FC = () => {
  const wide = useMediaQuery(WIDE);
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
