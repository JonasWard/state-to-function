import { Popover } from '../../Components/ui/Popover';
import React, { useState } from 'react';
import { OptionGrid } from '../../Components/inputs/OptionGrid';
import { Op, OP_LABEL, OP_SYMBOL } from '../../model/operators';
import styles from './expression.module.css';
import { operatorOptions } from './operatorOptions';
import { ReferenceContext } from './context';
import type { EnclosingTerm } from './ExpressionView';
import { OperandPicker } from './OperandPicker';

/**
 * The operator glyph between operands; opens the operator grid. Division renders as a fraction bar. Inside a
 * bracket it opens the term picker instead, so the whole bracket can also become an input, result or constant.
 */
export const OperatorButton: React.FC<{ op: Op; onChange: (op: Op) => void; term?: EnclosingTerm; context: ReferenceContext }> = ({
  op,
  onChange,
  term,
  context
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label={term ? 'Term' : 'Operation'}
      content={
        term ? (
          <OperandPicker value={term.value} onChange={term.onChange} onDone={() => setOpen(false)} context={context} />
        ) : (
          <OptionGrid title="Operation" options={operatorOptions} selectedKey={op} onSelect={(o) => (onChange(o), setOpen(false))} />
        )
      }
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
