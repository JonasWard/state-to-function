import { Button, Checkbox, Popover } from 'antd';
import { useMemo } from 'react';
import { IntNode, EnumArrayNode, EnumOptionsNode } from 'url-safe-bitpacking';
import { InputDefinitionTypes } from '../../../modelDefinition/newModel';
import { SymbolNameType } from '../../../specificInputs/NameEditor';
import { HardcodedNumber } from '../../inputs/HardcodedNumber';
import { SymbolRenderer } from '../icon/SymbolRenderer';
import { MethodFlatRenderer } from './MethodFlatRenderer';
import { MethodHandlingProps } from './methodType';
import React from 'react';
import { getText } from '../../../lib/textHelpers';

const Cell: React.FC<{ value: SymbolNameType; name: string; activeName: string; onClick: () => void }> = ({
  value: [symbol, subscript],
  name,
  activeName,
  onClick
}) => (
  <span
    onClick={(e) => (onClick(), e.stopPropagation())}
    className={activeName === name ? 'symbol-boxes selected' : 'symbol-boxes'}
  >
    <SymbolRenderer {...{ symbol, subscript, size: '.8rem' }} />
  </span>
);

const StyledGrid: React.FC<{
  values: SymbolNameType[];
  select: (i: number) => void;
  parentName: string;
  activeName: string;
}> = ({ values, select, parentName, activeName }) => (
  <div className="symbol-editor">
    {values.map((sn, index) => (
      <Cell value={sn} name={`${parentName}[${index}]`} activeName={activeName} onClick={() => select(index)} />
    ))}
  </div>
);

const ValuesGrid: React.FC<MethodHandlingProps> = ({
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
      Available Numeric Inputs
      <StyledGrid
        values={availableNumericInputs}
        select={(i) => (
          node.updateState(node.descriptor.mapping.indexOf('numericInput')),
          (node.getChildData()![0] as IntNode).updateValue(i),
          forceRender()
        )}
        parentName="numericInput"
        activeName={activeKey}
      />
      Available Method Outputs
      <StyledGrid
        values={availableMethodInputs}
        select={(i) => (
          node.updateState(node.descriptor.mapping.indexOf('methodOutput')),
          (node.getChildData()![0] as IntNode).updateValue(i),
          forceRender()
        )}
        parentName="methodOutput"
        activeName={activeKey}
      />
      Hardcoded Value
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
      Method
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
          <MethodFlatRenderer
            node={node.getChildData()![0] as EnumOptionsNode}
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
