import React from 'react';
import styles from './Section.module.css';

/** Small-caps section title with an icon, and optional right-aligned content such as a count or an action. */
export const SectionHeader: React.FC<{ id?: string; icon: React.ReactNode; title: string; aside?: React.ReactNode }> = ({
  id,
  icon,
  title,
  aside
}) => (
  <header className={styles.header}>
    <h2 id={id} className={styles.title}>
      {icon} {title}
    </h2>
    {aside && <span className={styles.aside}>{aside}</span>}
  </header>
);
