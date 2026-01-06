import React from 'react';
import { ArrayNode, EnumArrayNode, EnumOptionsNode, FloatNode, IntNode } from 'url-safe-bitpacking';
import { SpecificNodeUI } from './SpecificNodeUI';
import { Select } from 'antd';
import './reference-name.css';
import { NamedInputsArrayContentRenderer, NamedInputsArrayEditor } from './NameEditor';

export const NumericInputsArray: React.FC<{ node: ArrayNode; forceRender: () => void }> = ({ node, forceRender }) => (
  <NamedInputsArrayEditor
    node={node}
    name="Numeric Inputs"
    forceRender={forceRender}
    contentRenderer={NumericValuesForInputs}
  />
);

const NumericValuesForInputs: NamedInputsArrayContentRenderer = (node, index, forceRender: () => void) => (
  <>
    <Select
      options={(node as EnumOptionsNode).descriptor.mapping.map((d, i) => ({ label: d, value: i }))}
      value={(node as EnumOptionsNode).state}
      onChange={(v) => ((node as EnumOptionsNode).updateState(v), forceRender())}
      key={`${index}-select`}
    />
    <div key={`${index}-values`} style={{ display: 'flex', gap: 4, minWidth: '100%' }}>
      {(node.getChildData() as (EnumArrayNode | IntNode | FloatNode)[]).map((child, i) => (
        <SpecificNodeUI key={`${index}-${i}`} node={child} forceRender={forceRender} />
      ))}
    </div>
  </>
);
