import React, { useRef } from 'react';
import styles from './Segmented.module.css';

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  /** accessible name when the label is an icon or a glyph */
  ariaLabel?: string;
  title?: string;
  disabled?: boolean;
}

/** A radio group drawn as connected buttons: arrow keys move the selection, Tab enters at the selected option. */
export const Segmented = <T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'default',
  block = false
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  size?: 'default' | 'small';
  block?: boolean;
}) => {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (step: number) => {
    const enabled = options.filter((o) => !o.disabled);
    const at = enabled.findIndex((o) => o.value === value);
    const next = enabled[(at + step + enabled.length) % enabled.length];
    onChange(next.value);
    buttons.current[options.indexOf(next)]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={[styles.group, size === 'small' && styles.small, block && styles.block].filter(Boolean).join(' ')}
    >
      {options.map((o, i) => (
        <button
          key={o.value}
          ref={(el) => {
            buttons.current[i] = el;
          }}
          type="button"
          role="radio"
          className={styles.option}
          aria-checked={o.value === value}
          aria-label={o.ariaLabel}
          title={o.title}
          disabled={o.disabled}
          tabIndex={o.value === value ? 0 : -1}
          onClick={() => onChange(o.value)}
          onKeyDown={(e) => {
            const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
            if (!step) return;
            e.preventDefault();
            move(step);
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};
