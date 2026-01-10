import React, { useMemo } from 'react';
import { ArrayNode, EnumOptionsNode } from 'url-safe-bitpacking';
import { MethodHandlingProps, getOperationForMethod, ShortSymbol } from './methodType';
import { AvailableMethodsTypes } from '../../../modelDefinition/newModel';
import { Popover } from 'antd';
import { LispStyle } from './MethodLispStyle';
import { useGlobalUIStore } from '../../../state/globalUIStore';
import { MethodValue } from './MethodValue';
import { MethodOperation } from './MethodOperation';

const DESKTOP_SYMBOL_SIZE = '1.2rem';
const MOBILE_SYMBOL_SIZE = '.95rem';

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
    <Popover trigger="click" content={<LispStyle {...props} node={props.node} />}>
      <div
        onClick={(e) => e.target !== e.currentTarget && e.stopPropagation()}
        style={{ padding: 0, margin: 0, border: 'none', height: 'auto', cursor: 'pointer' }}
      >
        <span
          className={`lisp-parent method-flat ${operation} ${isDesktop ? 'desktop' : 'mobile'}`}
          style={{ fontSize: isDesktop ? DESKTOP_SYMBOL_SIZE : MOBILE_SYMBOL_SIZE }}
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
        </span>
      </div>
    </Popover>
  );
};
