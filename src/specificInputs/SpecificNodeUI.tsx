import React from 'react';
import { GeneralContentSplitter, GeneralNodeUIRenderer } from '../NodeUI';
import { NodeUIProps, WrapperComponentFunction } from '../nodeProps';
import { EnumArrayNode, ObjectNode } from 'url-safe-bitpacking';
import { ROOT_NODE_NAME } from '../InputsRenderer';
import { InputMethodsComponent } from './InputMethodsComponent';
import { HardcodedNumber } from '../Components/inputs/HardcodedNumber';

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
  }
  return GeneralContentSplitter(node, forceRender, specificContentWrapper);
};

export const SpecificNodeUI: React.FC<NodeUIProps> = (props) => (
  <GeneralNodeUIRenderer customWrapper={specificContentWrapper} {...props} />
);
