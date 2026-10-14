import React from 'react';
import styles from './Spinner.module.css';

export const Spinner: React.FC<{ label?: string; size?: 'default' | 'small' }> = ({ label, size = 'default' }) => (
  <span className={`${styles.wrap} ${size === 'small' ? styles.small : ''}`} role="status" aria-label={label ?? 'Loading'}>
    <span className={styles.spinner} aria-hidden />
    {label && size !== 'small' && <span>{label}</span>}
  </span>
);
