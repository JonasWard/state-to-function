import React from 'react';
import { MethodHandlingProps, ShortSymbol } from './methodType';
import { Button } from 'antd';
import { IfMethodTypes } from '../../modelDefinition/newModel';

const getIfMethodSymbol = (method: (typeof IfMethodTypes)[number], index: number) => {
  switch (index) {
    case 0:
      return ShortSymbol[method];
    case 1:
      return '?';
    case 2:
      return ':';
  }
};

export const MethodOperation: React.FC<MethodHandlingProps & { index: number }> = (props) => {
  const method = props.node.descriptor.mapping[props.node.state];
  return (
    <Button type="text" size="small" className="method-operation">
      {method === 'division' ? (
        <span />
      ) : IfMethodTypes.includes(method as (typeof IfMethodTypes)[number]) ? (
        getIfMethodSymbol(method as (typeof IfMethodTypes)[number], props.index)
      ) : (
        ShortSymbol[method]
      )}
    </Button>
  );
};