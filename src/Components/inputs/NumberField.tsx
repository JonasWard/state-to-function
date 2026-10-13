import { InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import { groupDigits } from '../../model/numeric';
import styles from './NumberField.module.css';

const ungroup = (s: string | undefined) => (s ?? '').replace(/\u202F/g, '');

/** Number input that keeps a draft while typing and commits on blur or Enter; digits are grouped while not editing. */
export const NumberField: React.FC<{
  value: number;
  onCommit: (value: number) => void;
  ariaLabel: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  status?: 'error' | 'warning';
}> = ({ value, onCommit, ariaLabel, ...props }) => {
  const [draft, setDraft] = useState<number | null>(value);
  const [focused, setFocused] = useState(false);
  useEffect(() => setDraft(value), [value]);
  const commit = () => {
    if (draft === null || !Number.isFinite(draft) || draft === value) return setDraft(value);
    onCommit(draft);
  };
  return (
    <InputNumber
      {...props}
      className={styles.field}
      value={draft}
      onChange={(v) => setDraft(typeof v === 'number' ? v : null)}
      onFocus={() => setFocused(true)}
      onBlur={() => (setFocused(false), commit())}
      onPressEnter={commit}
      formatter={focused ? undefined : (v) => groupDigits(String(v ?? ''))}
      parser={ungroup}
      controls={false}
      aria-label={ariaLabel}
    />
  );
};
