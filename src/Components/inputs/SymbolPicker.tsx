import { Popover } from 'antd';
import React, { useState } from 'react';
import { SYMBOL_CHARS } from '../../model/charsets';
import { MathSymbol } from '../math/MathSymbol';
import { symbolLabel } from '../math/symbolLabel';
import { OptionGrid } from './OptionGrid';
import styles from './SymbolPicker.module.css';

const options = SYMBOL_CHARS.map((c) => ({ key: c, label: <MathSymbol symbol={c} size="sm" />, ariaLabel: c }));

export const SymbolPicker: React.FC<{
  symbol: string;
  subscript: string;
  onChange: (symbol: string) => void;
  duplicate?: boolean;
}> = ({ symbol, subscript, onChange, duplicate }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomLeft"
      content={<OptionGrid title="Symbol" options={options} selectedKey={symbol} onSelect={(c) => (onChange(c), setOpen(false))} />}
    >
      <button
        type="button"
        className={`${styles.trigger} ${duplicate ? styles.duplicate : ''}`}
        aria-label={`Symbol ${symbolLabel(symbol, subscript)}${duplicate ? ' (used more than once)' : ''}, change`}
        title={duplicate ? 'This symbol and subscript are used more than once' : 'Change symbol'}
      >
        <MathSymbol symbol={symbol} subscript={subscript} size="lg" />
      </button>
    </Popover>
  );
};
