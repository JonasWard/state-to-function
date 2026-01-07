import React, { useMemo } from 'react';
import { ArrayNode, EnumArrayNode, EnumOptionsNode, IntNode } from 'url-safe-bitpacking';
import { MethodHandlingProps, getOperationForMethod, shortSymbol } from './methodType';
import { getText } from '../../../lib/textHelpers';
import { AvailableMethodsTypes, InputDefinitionTypes } from '../../../modelDefinition/newModel';
import { SymbolRenderer } from '../icon/SymbolRenderer';
import { Button, Popover } from 'antd';
import { LispStyle } from './LispStyle';

const ValueInput: React.FC<MethodHandlingProps> = ({ ...props }) => {
  const state = useMemo(
    () => props.node.descriptor.mapping[props.node.state] as (typeof InputDefinitionTypes)[number],
    [props.node.name, props.node.bitstring]
  );

  switch (state) {
    case 'numericInput':
    case 'methodOutput':
      const [symbol, subscript] = (
        state === 'numericInput' ? props.availableNumericInputs : props.availableMethodInputs
      )[(props.node.getChildData()![0] as IntNode).value];
      return <SymbolRenderer {...{ symbol, subscript, size: '.8rem' }} />;
    case 'hardcoded':
      return getText(props.node.getChildData()![0] as EnumArrayNode);
    case 'method':
      return <MethodFlatRenderer {...props} node={props.node.getChildData()![0] as EnumOptionsNode} />;
  }
};

const OperationIcon: React.FC<{ operation: (typeof AvailableMethodsTypes)[number] }> = ({ operation }) =>
  shortSymbol[operation];

export const MethodFlatRenderer: React.FC<MethodHandlingProps> = (props) => {
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

  return (
    <Popover trigger="click" content={<LispStyle {...props} node={props.node} />}>
      <div
        onClick={(e) => e.target !== e.currentTarget && e.stopPropagation()}
        style={{ padding: 0, margin: 0, border: 'none', height: 'auto', cursor: 'pointer' }}
      >
        <span className={`lisp-parent method-flat ${operation}`}>
          <ValueInput key={'a'} {...props} node={nodeA} />
          <OperationIcon operation={operation} />
          <ValueInput key={'b'} {...props} node={nodeB} />
          {otherNodes.map((node, i) => (
            <>
              <OperationIcon operation={operation} />
              <ValueInput key={i} {...props} node={node} />
            </>
          ))}
        </span>
      </div>
    </Popover>
  );
};
