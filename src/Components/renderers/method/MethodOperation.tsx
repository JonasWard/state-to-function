import { Button, Popover } from 'antd';
import React from 'react';
import { EnumOptionsNode } from 'url-safe-bitpacking';
import { ShortSymbol } from './methodType';

const Cell: React.FC<{ value: string; name: string; activeName: string; onClick: () => void }> = ({
  value,
  name,
  activeName,
  onClick
}) => (
  <span
    onClick={(e) => (onClick(), e.stopPropagation())}
    className={activeName === name ? 'symbol-boxes selected' : 'symbol-boxes'}
  >
    {value}
  </span>
);

const StyledGrid: React.FC<{
  values: string[];
  select: (i: number) => void;
  activeName: string;
}> = ({ values, select, activeName }) => (
  <div className="symbol-editor">
    {values.map((sn, index) => (
      <Cell value={ShortSymbol[sn]} name={sn} activeName={activeName} onClick={() => select(index)} />
    ))}
  </div>
);

export const MethodOperation: React.FC<{ node: EnumOptionsNode; forceRender: () => void; disabled?: boolean }> = ({
  node,
  forceRender
}) => (
  <Popover
    trigger="click"
    content={
      <StyledGrid
        values={node.descriptor.mapping.map((method) => method) as string[]}
        select={(i) => (node.updateState(i), forceRender())}
        activeName={node.descriptor.mapping[node.state] as string}
      />
    }
  >
    {
      <Button type="text" size="small" onClick={(e) => e.stopPropagation()}>
        {node.descriptor.mapping[node.state] === 'division' ? (
          <span />
        ) : (
          ShortSymbol[node.descriptor.mapping[node.state]]
        )}
      </Button>
    }
  </Popover>
);
