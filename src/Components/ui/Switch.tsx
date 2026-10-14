import React from 'react';
import styles from './Switch.module.css';

/** A toggle button; put it inside a <label> to give it a name. */
export const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
  <button type="button" role="switch" aria-checked={checked} className={styles.switch} onClick={() => onChange(!checked)}>
    <span className={styles.thumb} />
  </button>
);
