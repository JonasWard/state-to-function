import { Button, Checkbox, Popover } from 'antd';
import { useMemo } from 'react';
import { IntNode, EnumArrayNode, EnumOptionsNode } from 'url-safe-bitpacking';
import { InputDefinitionTypes } from '../../../modelDefinition/newModel';
import { HardcodedNumber } from '../../inputs/HardcodedNumber';
import { SymbolRenderer } from '../icon/SymbolRenderer';
import { MethodFlatRenderer } from './MethodFlatRenderer';
import { MethodHandlingProps, ShortSymbol } from './methodType';
import React from 'react';
import { getText } from '../../../lib/textHelpers';
import { MethodOptionsGrid } from './MethodOptionsGrid';
import './method.css';

const nameKeyMap: Record<(typeof InputDefinitionTypes)[number], string> = {
  numericInput: 'Numeric Inputs',
  methodOutput: 'Method Outputs',
  hardcoded: 'Hardcoded Value',
  method: 'Method'
};

const MethodGrid: React.FC<MethodHandlingProps> = ({ node, forceRender }) => {
  const child = node.getChildData()![0] as EnumOptionsNode;

  return (
    <MethodOptionsGrid
      values={child.descriptor.mapping.map((method) => ShortSymbol[method])}
      select={(i) => (child.updateState(i), forceRender())}
      activeName={ShortSymbol[child.descriptor.mapping[child.state]]}
      parentName={''}
    />
  );
};

export const ValuesGrid: React.FC<MethodHandlingProps> = ({
  node,
  availableNumericInputs,
  availableMethodInputs,
  forceRender
}) => {
  const activeKey = getOptionValue(node)!;

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '1rem', fontWeight: 'bold' }}
      onClick={(e) => e.stopPropagation()}
    >
      <MethodOptionsGrid
        values={availableNumericInputs}
        select={(i) => (
          node.updateState(node.descriptor.mapping.indexOf('numericInput')),
          (node.getChildData()![0] as IntNode).updateValue(i),
          forceRender()
        )}
        parentName={nameKeyMap.numericInput}
        activeName={activeKey}
      />
      <MethodOptionsGrid
        values={availableMethodInputs}
        select={(i) => (
          node.updateState(node.descriptor.mapping.indexOf('methodOutput')),
          (node.getChildData()![0] as IntNode).updateValue(i),
          forceRender()
        )}
        parentName={nameKeyMap.methodOutput}
        activeName={activeKey}
      />
      {nameKeyMap.hardcoded}
      <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Checkbox
          checked={node.descriptor.mapping[node.state] === 'hardcoded'}
          onChange={(e) => {
            node.updateState(
              e.target.checked
                ? node.descriptor.mapping.indexOf('hardcoded')
                : node.descriptor.mapping.indexOf('method')
            );
            forceRender();
          }}
        />
        {node.descriptor.mapping[node.state] === 'hardcoded' ? (
          <HardcodedNumber size="small" node={node.getChildData()![0] as EnumArrayNode} forceRender={forceRender} />
        ) : null}
      </span>
      {nameKeyMap.method}
      <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Checkbox
          checked={node.descriptor.mapping[node.state] === 'method'}
          onChange={(e) => {
            node.updateState(
              e.target.checked
                ? node.descriptor.mapping.indexOf('method')
                : node.descriptor.mapping.indexOf('hardcoded')
            );
            forceRender();
          }}
        />
        {node.descriptor.mapping[node.state] === 'method' ? (
          <MethodGrid
            node={node}
            forceRender={forceRender}
            availableNumericInputs={availableNumericInputs}
            availableMethodInputs={availableMethodInputs}
          />
        ) : null}
      </span>
    </div>
  );
};

const getOptionValue = (node: EnumOptionsNode) => {
  const state = node.descriptor.mapping[node.state];
  switch (state) {
    case 'hardcoded':
    case 'method':
      return state;
    case 'numericInput':
    case 'methodOutput':
      return `${nameKeyMap[state]}[${(node.getChildData()![0] as IntNode).value}]`;
  }
};

const ValueInput: React.FC<MethodHandlingProps> = ({ ...props }) => {
  const state = useMemo(
    () => props.node.descriptor.mapping[props.node.state] as (typeof InputDefinitionTypes)[number],
    [props.node.name, props.node.bitstring]
  );

  switch (state) {
    case 'numericInput':
      return (
        <Button type="text" size="small">
          <SymbolRenderer
            {...{
              symbol: props.availableNumericInputs[(props.node.getChildData()![0] as IntNode).value][0],
              subscript: props.availableNumericInputs[(props.node.getChildData()![0] as IntNode).value][1],
              size: 'small'
            }}
          />
        </Button>
      );
    case 'methodOutput':
      return (
        <Button type="text" size="small">
          <SymbolRenderer
            {...{
              symbol: props.availableMethodInputs[(props.node.getChildData()![0] as IntNode).value][0],
              subscript: props.availableMethodInputs[(props.node.getChildData()![0] as IntNode).value][1],
              size: 'small'
            }}
          />
        </Button>
      );
    case 'hardcoded':
      return <Button type="text" size="small" children={getText(props.node.getChildData()![0] as EnumArrayNode)} />;
    case 'method':
      return <MethodFlatRenderer {...props} node={props.node.getChildData()![0] as EnumOptionsNode} />;
  }
};

export const MethodValue: React.FC<MethodHandlingProps> = (props) => (
  <Popover trigger="click" content={<ValuesGrid {...props} />}>
    <span
      style={{ padding: 0, margin: 0, cursor: 'pointer' }}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={(e) => e.stopPropagation()}
    >
      <ValueInput {...props} />
    </span>
  </Popover>
);
