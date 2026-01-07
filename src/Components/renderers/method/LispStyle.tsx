import { ArrayNode, EnumArrayNode, EnumOptionsNode, IntNode } from 'url-safe-bitpacking';
import { InputDefinitionTypes } from '../../../modelDefinition/newModel';
import React, { ReactNode, useMemo } from 'react';
import { Button, Select } from 'antd';
import './method.css';
import { SymbolNameType } from '../../../specificInputs/NameEditor';
import { SymbolRenderer } from '../icon/SymbolRenderer';
import { HardcodedNumber } from '../../inputs/HardcodedNumber';
import {
  selectVariantMethod,
  shortSymbol,
  TypeSymbol,
  MethodHandlingProps,
  selectVariantData,
  getOperationForMethod
} from './methodType';
import { MethodFlatRenderer } from './MethodFlatRenderer';

const MethodSelect: React.FC<{ node: EnumOptionsNode; forceRender: () => void; disabled?: boolean }> = ({
  node,
  forceRender,
  disabled
}) => (
  <Select
    variant={selectVariantMethod}
    style={{ height: '24px', color: node.descriptor.mapping[node.state] === 'division' ? 'transparent' : 'inherit' }}
    onChange={(e) => (node.updateState(e), forceRender())}
    value={node.state}
    options={node.descriptor.mapping.map((method, value) => ({ label: shortSymbol[method], value }))}
    disabled={disabled}
  />
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
        variant={selectVariantData}
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
      return <HardcodedNumber {...props} size="small" node={props.node.getChildData()![0] as EnumArrayNode} />;
    case 'method':
      return <MethodFlatRenderer {...props} node={props.node.getChildData()![0] as EnumOptionsNode} />;
  }
};

const AddRemoveTerm: React.FC<{ onAdd?: () => void; onRemove?: () => void }> = ({ onAdd, onRemove }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Button
      size="small"
      style={{ maxWidth: 20, maxHeight: 11, fontSize: 10, textJustify: 'distribute', justifyContent: 'center' }}
      type="text"
      disabled={!onRemove}
      onClick={onRemove}
    >
      -
    </Button>
    <Button
      size="small"
      style={{ maxWidth: 20, maxHeight: 11, fontSize: 10, textJustify: 'distribute', justifyContent: 'center' }}
      type="text"
      disabled={!onAdd}
      onClick={onAdd}
    >
      +
    </Button>
  </div>
);

export const LispStyle: React.FC<MethodHandlingProps> = (props) => {
  const [nodeArray, [nodeA, nodeB, ...otherNodes]] = useMemo(() => {
    const nodeArray = props.node.getChildData()![0] as ArrayNode;
    const [nodeA, nodeB, ...otherNodes] = nodeArray.getChildren() as [
      EnumOptionsNode,
      EnumOptionsNode,
      ...EnumOptionsNode[]
    ];
    return [nodeArray, [nodeA, nodeB, ...otherNodes]];
  }, [props.node.name, props.node.bitstring]);

  const operation = getOperationForMethod(props.node);

  // this propagation is there to prevent parent divs to trigger when clicking any UI items the lisp style renderer of the method
  return (
    <span className={`lisp-parent ${operation}`} onClick={(e) => e.stopPropagation()}>
      <ValueWrapper key={'a'} {...props} node={nodeA} />
      <MethodSelect {...props} />
      <ValueWrapper key={'b'} {...props} node={nodeB} />
      {otherNodes.map((node, i) => (
        <>
          <MethodSelect disabled key={i + 'method'} {...props} />
          <ValueWrapper key={i} {...props} node={node} />
        </>
      ))}
      {operation === 'addition' || operation === 'multiplication' ? (
        <AddRemoveTerm
          onAdd={
            nodeArray.state < nodeArray.descriptor.maxCount
              ? () => (nodeArray.updateState(nodeArray.state + 1), props.forceRender())
              : undefined
          }
          onRemove={
            nodeArray.state > nodeArray.descriptor.minCount
              ? () => (nodeArray.updateState(nodeArray.state - 1), props.forceRender())
              : undefined
          }
        />
      ) : null}
    </span>
  );
};
