import { Segmented } from 'antd';
import React from 'react';
import { ConstantInput } from '../../Components/inputs/ConstantInput';
import { OptionGrid } from '../../Components/inputs/OptionGrid';
import { MathSymbol } from '../../Components/math/MathSymbol';
import { symbolLabel } from '../../Components/math/symbolLabel';
import { defaultOperand } from '../../model/defaults';
import { changeOperator } from '../../model/ops';
import { Label, Operand, OperandType } from '../../model/types';
import { ReferenceContext } from './context';
import sectionStyles from '../../Components/layout/Section.module.css';
import styles from './expression.module.css';
import { operatorOptions } from './operatorOptions';

const TYPE_OPTIONS: { value: OperandType; label: string }[] = [
  { value: 'numericInput', label: 'Input' },
  { value: 'methodOutput', label: 'Result' },
  { value: 'hardcoded', label: 'Constant' },
  { value: 'method', label: 'Expression' }
];

const symbolOptions = (labels: Label[]) =>
  labels.map((l, i) => ({
    key: i,
    label: <MathSymbol symbol={l.symbol} subscript={l.subscript} size="sm" />,
    ariaLabel: `${symbolLabel(l.symbol, l.subscript)}${l.name ? `, ${l.name}` : ''}`
  }));

/** Switching type keeps what it can: a sub-expression starts with the current operand as its first term. */
const convert = (value: Operand, type: OperandType): Operand => {
  switch (type) {
    case 'numericInput':
    case 'methodOutput':
      return { type, index: 0 };
    case 'hardcoded':
      return defaultOperand();
    case 'method':
      return { type: 'method', method: { op: 'addition', values: [value, defaultOperand()] } };
  }
};

export const OperandPicker: React.FC<{
  value: Operand;
  onChange: (value: Operand) => void;
  onDone: () => void;
  context: ReferenceContext;
}> = ({ value, onChange, onDone, context }) => (
  <div className={styles.picker}>
    <p className={sectionStyles.label}>Term</p>
    <Segmented
      size="small"
      block
      value={value.type}
      options={TYPE_OPTIONS.map((o) => ({
        ...o,
        disabled: o.value === 'methodOutput' && !context.methods.length
      }))}
      onChange={(t) => onChange(convert(value, t as OperandType))}
    />
    {value.type === 'numericInput' && (
      <OptionGrid
        title="Input"
        options={symbolOptions(context.inputs)}
        selectedKey={value.index}
        onSelect={(index) => (onChange({ type: 'numericInput', index }), onDone())}
      />
    )}
    {value.type === 'methodOutput' && (
      <OptionGrid
        title="Result of an earlier method"
        empty="No earlier methods"
        options={symbolOptions(context.methods)}
        selectedKey={value.index}
        onSelect={(index) => (onChange({ type: 'methodOutput', index }), onDone())}
      />
    )}
    {value.type === 'hardcoded' && (
      <ConstantInput value={value.value} ariaLabel="Constant value" onCommit={(v) => onChange({ type: 'hardcoded', value: v })} />
    )}
    {value.type === 'method' && (
      <OptionGrid
        title="Operation"
        options={operatorOptions}
        selectedKey={value.method.op}
        onSelect={(op) => (onChange({ type: 'method', method: changeOperator(value.method, op) }), onDone())}
      />
    )}
  </div>
);
