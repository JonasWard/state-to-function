import React, { useEffect, useState } from 'react';
import { clamp, groupDigits, roundTo } from '../../model/numeric';
import field from '../ui/field.module.css';

const ungroup = (s: string) => s.replace(/\u202F/g, '').replace(',', '.').trim();

/**
 * Number input that keeps a draft while typing and commits on blur or Enter (Escape reverts).
 * The committed value is clamped to min/max and rounded to `precision`; digits are grouped while not editing.
 */
export const NumberField: React.FC<{
  value: number;
  onCommit: (value: number) => void;
  ariaLabel: string;
  min?: number;
  max?: number;
  precision?: number;
  status?: 'error' | 'warning';
}> = ({ value, onCommit, ariaLabel, min = -Infinity, max = Infinity, precision, status }) => {
  const [draft, setDraft] = useState(String(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    const parsed = Number(ungroup(draft));
    if (ungroup(draft) === '' || !Number.isFinite(parsed)) return setDraft(String(value));
    const fitted = clamp(parsed, min, max);
    const next = precision === undefined ? fitted : roundTo(fitted, 10 ** -precision);
    if (next !== value) onCommit(next);
    setDraft(String(next));
  };

  return (
    <input
      className={`${field.field} ${field.mono} ${status ? field[status] : ''}`}
      inputMode="decimal"
      value={focused ? draft : groupDigits(draft)}
      aria-label={ariaLabel}
      aria-invalid={status === 'error' || undefined}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => (setFocused(false), commit())}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') setDraft(String(value));
      }}
    />
  );
};
