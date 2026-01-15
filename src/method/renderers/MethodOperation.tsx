import React from 'react';
import { MethodHandlingProps, ShortSymbol } from './methodType';
import { Button } from 'antd';

export const MethodOperation: React.FC<MethodHandlingProps> = (props) => (
  <Button type="text" size="small" className="method-operation">
    {props.node.descriptor.mapping[props.node.state] === 'division' ? (
      <span />
    ) : (
      ShortSymbol[props.node.descriptor.mapping[props.node.state]]
    )}
  </Button>
);
