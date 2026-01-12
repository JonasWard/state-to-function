import { Button } from 'antd';
import React from 'react';
import { MethodHandlingProps, ShortSymbol } from './methodType';

export const MethodOperation: React.FC<MethodHandlingProps> = (props) => (
  <Button type="text" size="small" style={{ padding: 1 }}>
    {props.node.descriptor.mapping[props.node.state] === 'division' ? (
      <span />
    ) : (
      ShortSymbol[props.node.descriptor.mapping[props.node.state]]
    )}
  </Button>
);
