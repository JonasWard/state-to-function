import React from 'react';
import { TNodeUIProps } from '../../nodeProps';
import { EnumOptionsNode } from 'url-safe-bitpacking';
import { SpecificNodeUI } from '../../specificInputs/SpecificNodeUI';
import { Select } from 'antd';

export const NumericInput: React.FC<TNodeUIProps<EnumOptionsNode>> = ({ node, forceRender }) => (
  <>
    <Select
      options={(node as EnumOptionsNode).descriptor.mapping.map((d, i) => ({ label: d, value: i }))}
      value={(node as EnumOptionsNode).state}
      onChange={(v) => ((node as EnumOptionsNode).updateState(v), forceRender())}
    />
    <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
      {node.getChildData()!.map((child, i) => (
        <SpecificNodeUI key={i} node={child!} forceRender={forceRender} />
      ))}
    </div>
  </>
);
