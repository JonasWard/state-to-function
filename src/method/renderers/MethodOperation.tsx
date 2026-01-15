import React from 'react';
import { MethodHandlingProps, ShortSymbol } from './methodType';

export const MethodOperation: React.FC<MethodHandlingProps> = (props) => (
  <span className="method-operation">
    {props.node.descriptor.mapping[props.node.state] === 'division' ? (
      <span />
    ) : (
      ShortSymbol[props.node.descriptor.mapping[props.node.state]]
    )}
  </span>
);
