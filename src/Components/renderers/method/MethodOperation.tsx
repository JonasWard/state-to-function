import { Button, Popover } from 'antd';
import React from 'react';
import { MethodHandlingProps, ShortSymbol } from './methodType';
import { ValuesGrid } from './MethodValue';

export const MethodOperation: React.FC<MethodHandlingProps> = (props) => (
  <Popover trigger="click" content={<ValuesGrid {...props} />}>
    <Button type="text" size="small" onClick={(e) => e.stopPropagation()}>
      {props.node.descriptor.mapping[props.node.state] === 'division' ? (
        <span />
      ) : (
        ShortSymbol[props.node.descriptor.mapping[props.node.state]]
      )}
    </Button>
  </Popover>
);
