import { ArrayNode, EnumArrayNode, EnumOptionsNode, IntNode } from 'url-safe-bitpacking';
import { AvailableMethodsTypes, InputDefinitionTypes } from '../../../modelDefinition/newModel';
import React, { ReactNode, useMemo } from 'react';
import { Select } from 'antd';
import './method.css';
import { SymbolNameType } from '../../../specificInputs/NameEditor';
import { SymbolRenderer } from '../icon/SymbolRenderer';
import { TNodeUIProps } from '../../../nodeProps';
import { HardcodedNumber } from '../../inputs/HardcodedNumber';

const shortSymbol: Record<(typeof AvailableMethodsTypes)[number], string> = {
  addition: '+',
  multiplication: 'x',
  subtraction: '-',
  division: '/',
  power: '^'
};

const MethodSelect: React.FC<{ node: EnumOptionsNode; forceRender: () => void }> = ({ node, forceRender }) => (
  <select
    style={{ height: '24px' }}
    onChange={(e) => (node.updateState(Number(e.target.value)), forceRender())}
    value={node.state}
  >
    {node.descriptor.mapping.map((method, value) => (
      <option key={value} value={value}>
        {shortSymbol[method]}
      </option>
    ))}
  </select>
);

const getSelectOptions = (
  sns: SymbolNameType[],
  name: (typeof InputDefinitionTypes)[number]
): { label: ReactNode; value: string }[] =>
  sns.map(([symbol, subscript], value) => ({
    label: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <SymbolRenderer {...{ symbol, subscript, size: '.8rem' }} />
        <span>({TypeSymbol[name]})</span>
      </span>
    ),
    value: `${name}[${value}]`
  }));

const TypeSymbol: Record<(typeof InputDefinitionTypes)[number], string> = {
  hardcoded: '𝑐',
  numericInput: 'ℝ',
  methodOutput: '𝑓()',
  method: '𝑓'
};

type MethodHandlingProps = TNodeUIProps<EnumOptionsNode> & {
  availableNumericInputs: SymbolNameType[];
  availableMethodInputs: SymbolNameType[];
};

const getOptionValues = (
  availableNumericInputs: SymbolNameType[],
  availableMethodInputs: SymbolNameType[]
): { label: ReactNode; value: string }[] => {
  const options: { label: ReactNode; value: string }[] = [];

  // adding reference types
  options.push(...getSelectOptions(availableNumericInputs, 'numericInput'));
  options.push(...getSelectOptions(availableMethodInputs, 'methodOutput'));
  options.push({ label: <span>{TypeSymbol.method}</span>, value: 'method' });
  options.push({ label: <span>{TypeSymbol.hardcoded}</span>, value: 'hardcoded' });

  return options;
};

const handleOptionChange = (node: EnumOptionsNode, optionId: string, forceRender: () => void) => {
  // simple update of state
  if (optionId.indexOf('hardcoded') === 0)
    node.updateState((node.descriptor.mapping as unknown as typeof InputDefinitionTypes).indexOf('hardcoded'));
  if (optionId.indexOf('method') === 0)
    node.updateState((node.descriptor.mapping as unknown as typeof InputDefinitionTypes).indexOf('method'));
  // also set the index of the first child after having updated the state
  if (optionId.indexOf('numericInput') === 0) {
    node.updateState((node.descriptor.mapping as unknown as typeof InputDefinitionTypes).indexOf('numericInput'));
    const entryIndex = Number(optionId.split('[')[1].split(']')[0]);
    (node.getChildData()![0] as IntNode).updateValue(entryIndex);
  }
  if (optionId.indexOf('methodOutput') === 0) {
    node.updateState((node.descriptor.mapping as unknown as typeof InputDefinitionTypes).indexOf('methodOutput'));
    const entryIndex = Number(optionId.split('[')[1].split(']')[0]);
    (node.getChildData()![0] as IntNode).updateValue(entryIndex);
  }
  forceRender();
};

const ValueWrapper: React.FC<MethodHandlingProps> = (props) =>
  props.node && props.node.descriptor && props.node.descriptor.mapping ? (
    <span style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
      <Select
        style={{ height: '24px', minWidth: '50px' }}
        value={getOptionValue(props.node)}
        onChange={
          ((_, { value }: { label: ReactNode; value: string }) =>
            handleOptionChange(props.node, value, props.forceRender)) as any
        }
        options={getOptionValues(props.availableNumericInputs, props.availableMethodInputs)}
      />
      <ValueInput {...props} />
    </span>
  ) : (
    <>{props.node.name}</>
  );

const getOptionValue = (node: EnumOptionsNode) => {
  const state = node.descriptor.mapping[node.state];
  switch (state) {
    case 'hardcoded':
    case 'method':
      return state;
    case 'numericInput':
    case 'methodOutput':
      return `${state}[${(node.getChildData()![0] as IntNode).value}]`;
  }
};

const ValueInput: React.FC<MethodHandlingProps> = ({ ...props }) => {
  const state = useMemo(
    () => props.node.descriptor.mapping[props.node.state] as (typeof InputDefinitionTypes)[number],
    [props.node.name, props.node.bitstring]
  );

  switch (state) {
    case 'numericInput':
      return null;
    case 'methodOutput':
      return null;
    case 'hardcoded':
      return (
        <HardcodedNumber
          {...props}
          size={'small'}
          styleOverwrite={{ minWidth: 40, maxWidth: 60 }}
          node={props.node.getChildData()![0] as EnumArrayNode}
        />
      );
    case 'method':
      return <LispStyle {...props} node={props.node.getChildData()![0] as EnumOptionsNode} />;
  }
};

export const LispStyle: React.FC<MethodHandlingProps> = (props) => {
  const children = useMemo(
    () => (props.node.getChildData()![0] as ArrayNode).getChildren() as EnumOptionsNode[],
    [props.node.name, props.node.bitstring]
  );

  return (
    <span className="lisp-parent">
      <MethodSelect {...props} />
      {children.map((child, i) => (
        <>
          <span>,</span>
          <ValueWrapper key={i} {...props} node={child} />
        </>
      ))}
    </span>
  );
};
