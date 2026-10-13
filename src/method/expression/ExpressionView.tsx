import React, { Fragment } from 'react';
import { changeOperator, updateAt } from '../../model/ops';
import { isConditional, OP_ARITY } from '../../model/operators';
import { defaultOperand } from '../../model/defaults';
import { Expr, Operand } from '../../model/types';
import { ReferenceContext } from './context';
import styles from './expression.module.css';
import { OperandView } from './OperandView';
import { OperatorButton } from './OperatorButton';

/** Renders `a op b op c`, `a < b ? c : d` or a fraction for division; every part is editable in place. */
export const ExpressionView: React.FC<{ value: Expr; onChange: (value: Expr) => void; context: ReferenceContext }> = ({
  value,
  onChange,
  context
}) => {
  const { op, values } = value;
  const operand = (i: number) => (
    <OperandView
      value={values[i]}
      context={context}
      onChange={(o: Operand) => onChange({ op, values: updateAt(values, i, o) })}
    />
  );
  const operator = <OperatorButton op={op} onChange={(next) => onChange(changeOperator(value, next))} />;

  if (op === 'division')
    return (
      <span className={styles.fraction}>
        {operand(0)}
        {operator}
        {operand(1)}
      </span>
    );

  if (isConditional(op))
    return (
      <span className={styles.expr}>
        {operand(0)}
        {operator}
        {operand(1)}
        <span className={styles.keyword}>?</span>
        {operand(2)}
        <span className={styles.keyword}>:</span>
        {operand(3)}
      </span>
    );

  const { min, max } = OP_ARITY[op];
  return (
    <span className={styles.expr}>
      {values.map((_, i) => (
        <Fragment key={i}>
          {i > 0 && operator}
          {operand(i)}
        </Fragment>
      ))}
      {min !== max && (
        <span className={styles.terms}>
          <button
            type="button"
            className={styles.term}
            aria-label="Add term"
            title="Add term"
            disabled={values.length >= max}
            onClick={() => onChange({ op, values: [...values, defaultOperand()] })}
          >
            +
          </button>
          <button
            type="button"
            className={styles.term}
            aria-label="Remove last term"
            title="Remove last term"
            disabled={values.length <= min}
            onClick={() => onChange({ op, values: values.slice(0, -1) })}
          >
            −
          </button>
        </span>
      )}
    </span>
  );
};
