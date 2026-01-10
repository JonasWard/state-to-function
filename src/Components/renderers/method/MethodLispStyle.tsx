import { ArrayNode, EnumOptionsNode } from 'url-safe-bitpacking';
import React, { useMemo } from 'react';
import { Button } from 'antd';
import './method.css';
import { MethodHandlingProps, getOperationForMethod } from './methodType';
import { MethodValue } from './MethodValue';
import { MethodOperation } from './MethodOperation';

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
      <MethodValue key={'a'} {...props} node={nodeA} />
      <MethodOperation {...props} />
      <MethodValue key={'b'} {...props} node={nodeB} />
      {otherNodes.map((node, i) => (
        <>
          <MethodOperation disabled key={i + 'method'} {...props} />
          <MethodValue key={i} {...props} node={node} />
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
