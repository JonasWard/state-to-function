import React from 'react';
import { GeneralContentSplitter, GeneralNodeUIRenderer, NodeWithChildrenWrapper } from '../NodeUI';
import { NodeUIProps, WrapperComponentFunction } from '../nodeProps';
import { EnumArrayNode, EnumOptionsNode, ObjectNode } from 'url-safe-bitpacking';
import { ROOT_NODE_NAME } from '../state/c';
import { InputMethodsComponent } from './InputMethodsComponent';
import { HardcodedNumber } from '../Components/inputs/HardcodedNumber';
import { Select } from 'antd';
import { NumericInput } from '../Components/inputs/NumericInput';

const specificContentWrapper: WrapperComponentFunction = (node, forceRender) =>
  SpecificContentSplitter(node, forceRender);

const SpecificContentSplitter: WrapperComponentFunction = (node, forceRender) => {
  switch (node.type) {
    case 'OBJECT':
      switch (node.name) {
        case ROOT_NODE_NAME:
          return <InputMethodsComponent node={node as ObjectNode} forceRender={forceRender} />;
      }
      break;
    case 'ENUM_ARRAY':
      switch (node.name) {
        case 'hardcoded':
          return <HardcodedNumber node={node as EnumArrayNode} forceRender={forceRender} />;
      }
      break;
    case 'ENUM_OPTIONS':
      switch (node.name) {
        case 'inputType':
          return <NumericInput node={node as EnumOptionsNode} forceRender={forceRender} />;
      }
  }
  return GeneralContentSplitter(node, forceRender, specificContentWrapper);
};

export const SpecificNodeUI: React.FC<NodeUIProps> = (props) => (
  <GeneralNodeUIRenderer customWrapper={specificContentWrapper} {...props} />
);
