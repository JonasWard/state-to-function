import React from 'react';
import styles from './OptionGrid.module.css';

export interface GridOption<K extends string | number> {
  key: K;
  label: React.ReactNode;
  ariaLabel: string;
}

export const OptionGrid = <K extends string | number>({
  options,
  selectedKey,
  onSelect,
  title,
  empty = 'Nothing to choose from'
}: {
  options: GridOption<K>[];
  selectedKey?: K;
  onSelect: (key: K) => void;
  title?: string;
  empty?: string;
}) => (
  <div>
    {title && <p className={styles.title}>{title}</p>}
    {options.length ? (
      <div className={styles.grid} role="group" aria-label={title}>
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            className={styles.cell}
            aria-label={o.ariaLabel}
            aria-pressed={o.key === selectedKey}
            onClick={() => onSelect(o.key)}
          >
            {o.label}
          </button>
        ))}
      </div>
    ) : (
      <span className={styles.empty}>{empty}</span>
    )}
  </div>
);
