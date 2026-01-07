import React from 'react';
import { getStateData, SpecificTypeNode, StateDataObjectValue } from 'url-safe-bitpacking';

/**
 * Helper method to display current state node
 * @param stateData
 */
const getStateDataString = (stateData: StateDataObjectValue): [number, string][] =>
  JSON.stringify(stateData, null, 2)
    .split('\n')
    .map((s) => {
      const trailingSpaces = s.match(/^\s*/)?.[0]?.length || 0;
      return [trailingSpaces, s];
    });

export const RenderStateNodeData: React.FC<{ node: SpecificTypeNode }> = ({ node }) => (
  <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 420, wordBreak: 'break-all' }}>
    {node.getBase64String()}
    {getStateDataString(getStateData(node.toDataEntry())).map(([trailingSpaces, line], i) => (
      <span key={i} style={{ paddingLeft: trailingSpaces * 8 }}>
        {line}
      </span>
    ))}
  </div>
);
