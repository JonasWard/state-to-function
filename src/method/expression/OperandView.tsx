import { Popover } from 'antd';
import React, { useState } from 'react';
import { MathSymbol } from '../../Components/math/MathSymbol';
import { symbolLabel } from '../../Components/math/symbolLabel';
import { Operand } from '../../model/types';
import { ReferenceContext } from './context';
import { ExpressionView } from './ExpressionView';
import styles from './expression.module.css';
import { OperandPicker } from './OperandPicker';

const Reference: React.FC<{ value: Extract<Operand, { index: number }>; context: ReferenceContext }> = ({
  value,
  context
}) => {
  const label = (value.type === 'numericInput' ? context.inputs : context.methods)[value.index];
  return label ? <MathSymbol symbol={label.symbol} subscript={label.subscript} size="sm" /> : <>?</>;
};

const describe = (value: Operand, context: ReferenceContext) => {
  switch (value.type) {
    case 'hardcoded':
      return `constant ${value.value || 'empty'}`;
    case 'method':
      return 'sub-expression';
    default: {
      const label = (value.type === 'numericInput' ? context.inputs : context.methods)[value.index];
      return label ? symbolLabel(label.symbol, label.subscript) : 'missing reference';
    }
  }
};

const isMissing = (value: Operand, context: ReferenceContext) =>
  (value.type === 'numericInput' && !context.inputs[value.index]) ||
  (value.type === 'methodOutput' && !context.methods[value.index]);

/** One operand: a symbol, a constant or a parenthesised sub-expression. Clicking it opens the operand picker. */
export const OperandView: React.FC<{ value: Operand; onChange: (value: Operand) => void; context: ReferenceContext }> = ({
  value,
  onChange,
  context
}) => {
  const [open, setOpen] = useState(false);
  const missing = isMissing(value, context);
  const trigger = (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      destroyOnHidden
      content={<OperandPicker value={value} onChange={onChange} onDone={() => setOpen(false)} context={context} />}
    >
      <button
        type="button"
        className={
          value.type === 'method'
            ? styles.paren
            : `${styles.token} ${value.type === 'hardcoded' ? styles.constant : ''} ${missing ? styles.missing : ''}`
        }
        aria-label={`${describe(value, context)}, change operand`}
        title={missing ? 'This reference no longer exists' : undefined}
      >
        {value.type === 'method' ? '(' : value.type === 'hardcoded' ? value.value || <span className={styles.empty}>∅</span> : <Reference value={value} context={context} />}
      </button>
    </Popover>
  );
  if (value.type !== 'method') return trigger;
  return (
    <span className={styles.expr}>
      {trigger}
      <ExpressionView value={value.method} onChange={(method) => onChange({ type: 'method', method })} context={context} />
      <span className={`${styles.paren} ${styles.closing}`} aria-hidden>
        )
      </span>
    </span>
  );
};
