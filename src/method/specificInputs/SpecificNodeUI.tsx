import React from 'react';
import { GeneralContentSplitter, GeneralNodeUIRenderer } from '../../urlBitPacking/NodeUI';
import { NodeUIProps, WrapperComponentFunction } from '../../urlBitPacking/nodeProps';
import { EnumArrayNode, EnumOptionsNode, FloatNode, IntNode, ObjectNode, SpecificTypeNode } from 'url-safe-bitpacking';
import { ROOT_NODE_NAME } from '../../state/c';
import { InputMethodsComponent } from './InputMethodsComponent';
import { HardcodedNumber } from '../../Components/inputs/HardcodedNumber';
import { NumericInput } from '../../Components/inputs/NumericInput';
import { TextInput } from '../../Components/TextInput';
import { InputNumberWrapper } from '../../Components/inputs/InputNumberWrapper';

const specificContentWrapper: WrapperComponentFunction = (node, forceRender) =>
  SpecificContentSplitter(node, forceRender);

const filledNumberInputs: string[] = [];
const outlinedNumberInputs = ['intValue', 'floatValue', 'intMin', 'intMax', 'floatMin', 'floatMax'];

const getVariant = (node: SpecificTypeNode) => {
  if (filledNumberInputs.includes(node.name)) return 'filled';
  if (outlinedNumberInputs.includes(node.name)) return 'outlined';
  return 'borderless';
};

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
        case 'subscript':
        case 'name':
          return <TextInput textEntry={node as EnumArrayNode} placeholder={node.name} forceRender={forceRender} variant='filled'/>;
      }
      break;
    case 'ENUM_OPTIONS':
      switch (node.name) {
        case 'inputType':
          return <NumericInput node={node as EnumOptionsNode} forceRender={forceRender} />;
      }
    case 'INT':
      return (
        <InputNumberWrapper
          size="middle"
          style={{ minWidth: '40px', width: '100%' }}
          value={(node as IntNode).value}
          onChange={(v) => (
            (node as IntNode).updateValue(v === null ? (node as IntNode).descriptor.value : v), forceRender()
          )}
          max={(node as IntNode).descriptor.max}
          min={(node as IntNode).descriptor.min}
          step={1}
          precision={0}
          variant={getVariant(node)}
        />
      );
    case 'FLOAT':
      return (
        <InputNumberWrapper
          size="middle"
          style={{ minWidth: '40px', width: '100%' }}
          value={(node as FloatNode).value}
          onChange={(v) => (
            (node as FloatNode).updateValue(v === null ? (node as FloatNode).descriptor.value : v), forceRender()
          )}
          max={(node as FloatNode).descriptor.max}
          min={(node as FloatNode).descriptor.min}
          step={10 ** -(node as FloatNode).descriptor.precision}
          precision={(node as FloatNode).descriptor.precision}
          variant={getVariant(node)}
        />
      );
  }
  return GeneralContentSplitter(node, forceRender, specificContentWrapper);
};

export const SpecificNodeUI: React.FC<NodeUIProps> = (props) => (
  <GeneralNodeUIRenderer customWrapper={specificContentWrapper} {...props} />
);
