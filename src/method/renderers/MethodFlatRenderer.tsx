import React, { useMemo } from 'react';
import { ArrayNode, EnumOptionsNode } from 'url-safe-bitpacking';
import { MethodHandlingProps, getOperationForMethod } from './methodType';
import { Button } from 'antd';
import { useGlobalUIStore } from '../../state/globalUIStore';
import { MethodValue } from './MethodValue';
import { MethodOperation } from './MethodOperation';

const DESKTOP_SYMBOL_SIZE = '1.2rem';
const MOBILE_SYMBOL_SIZE = '.95rem';

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
      onClick={(e) => (e.stopPropagation(), onAdd?.())}
    >
      +
    </Button>
  </div>
);

export const MethodFlatRenderer: React.FC<MethodHandlingProps> = (props) => {
  const { isDesktop } = useGlobalUIStore();

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
    <div
      className={`lisp-parent method-flat ${operation} ${isDesktop ? 'desktop' : 'mobile'}`}
      style={{ fontSize: isDesktop ? DESKTOP_SYMBOL_SIZE : MOBILE_SYMBOL_SIZE, cursor: 'pointer' }}
    >
      <MethodValue key={'a'} {...props} node={nodeA} />
      <MethodOperation {...props} />
      <MethodValue key={'b'} {...props} node={nodeB} />
      {otherNodes.map((node, i) => (
        <>
          <MethodOperation {...props} />
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
    </div>
  );
};
