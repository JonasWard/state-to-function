import { Popover } from '../../Components/ui/Popover';
import React, { useState } from 'react';
import { OptionGrid } from '../../Components/inputs/OptionGrid';
import { Op, OP_LABEL, OP_SYMBOL } from '../../model/operators';
import styles from './expression.module.css';
import { operatorOptions } from './operatorOptions';

/** The operator glyph between operands; opens the operator grid. Division renders as a fraction bar. */
export const OperatorButton: React.FC<{ op: Op; onChange: (op: Op) => void }> = ({ op, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label="Operation"
      content={<OptionGrid title="Operation" options={operatorOptions} selectedKey={op} onSelect={(o) => (onChange(o), setOpen(false))} />}
    >
      <button
        type="button"
        className={op === 'division' ? styles.bar : styles.op}
        aria-label={`${OP_LABEL[op]}, change operation`}
        title={OP_LABEL[op]}
      >
        {op === 'division' ? null : OP_SYMBOL[op]}
      </button>
    </Popover>
  );
};
