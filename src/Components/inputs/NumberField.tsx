import { InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';

/** Number input that keeps a draft while typing and commits on blur or Enter. */
export const NumberField: React.FC<{
  value: number;
  onCommit: (value: number) => void;
  ariaLabel: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  status?: 'error' | 'warning';
  className?: string;
}> = ({ value, onCommit, ariaLabel, ...props }) => {
  const [draft, setDraft] = useState<number | null>(value);
  useEffect(() => setDraft(value), [value]);
  const commit = () => {
    if (draft === null || !Number.isFinite(draft) || draft === value) return setDraft(value);
    onCommit(draft);
  };
  return (
    <InputNumber
      {...props}
      value={draft}
      onChange={(v) => setDraft(typeof v === 'number' ? v : null)}
      onBlur={commit}
      onPressEnter={commit}
      controls={false}
      aria-label={ariaLabel}
      style={{ width: '100%' }}
    />
  );
};
