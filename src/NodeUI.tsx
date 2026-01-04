import { Checkbox, InputNumber, Select } from 'antd';
import React from 'react';
import {
  BooleanNode,
  EnumNode,
  FloatNode,
  IntNode,
  SpecificTypeNode,
  ArrayNode,
  EnumOptionsNode,
  OptionalNode,
  VersionNode,
  EnumArrayNode
} from 'url-safe-bitpacking';
import { TextInput } from './Components/TextInput';
import { GeneralChildrenRenderer, NodeUIProps, TNodeUIProps, WrapperComponentFunction } from './nodeProps';

const nullContent = (
  <>
    <span>noName</span>
    <span>null</span>
  </>
);

export const NodeWithChildrenWrapper: React.FC<
  TNodeUIProps<ArrayNode | EnumOptionsNode | OptionalNode> & {
    stateChange: React.ReactNode;
    childrenRenderer: GeneralChildrenRenderer;
  }
> = ({ node, forceRender, stateChange, childrenRenderer }) => {
  return childrenRenderer(node.getChildren(), stateChange, forceRender);
};

const NodeWithChildrenUI: React.FC<
  TNodeUIProps<ArrayNode | EnumOptionsNode | OptionalNode> & {
    stateChange: React.ReactNode;
    wrapper: WrapperComponentFunction;
  }
> = (props) => (
  <NodeWithChildrenWrapper
    {...props}
    childrenRenderer={(children, stateChange, forceRender) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyItems: 'center' }}>
        {stateChange}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {children.map((child, i) => (child === null ? nullContent : props.wrapper(child, forceRender)))}
        </div>
      </div>
    )}
  />
);

export const GeneralNodeUIRenderer: React.FC<NodeUIProps & { customWrapper?: WrapperComponentFunction }> = ({
  node,
  forceRender,
  customWrapper
}) => (
  <div id={node.name} style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
    {(customWrapper ? customWrapper : generalContentWrapper)(node, forceRender)}
  </div>
);

const generalContentWrapper: WrapperComponentFunction = (node, forceRender) => (
  <>
    <span style={{ height: 32, display: 'flex', alignItems: 'center' }}>{node.name}</span>
    {GeneralContentSplitter(node, forceRender)}
  </>
);

export const GeneralContentSplitter = (
  node: SpecificTypeNode,
  forceRender: () => void,
  wrapper: WrapperComponentFunction = generalContentWrapper
) => {
  switch (node.type) {
    case 'VERSION':
      return (
        <Select
          options={Array.from({ length: 2 ** (node as VersionNode).descriptor.bits }, (_, i) => ({
            label: i,
            value: i
          }))}
          value={(node as VersionNode).value}
          onChange={(v) => ((node as VersionNode).updateValue(v), forceRender())}
        />
      );
    case 'BOOLEAN':
      return (
        <Checkbox
          checked={(node as BooleanNode).value}
          onChange={(v) => ((node as BooleanNode).updateValue(v.target.checked), forceRender())}
        />
      );
    case 'ENUM':
      return (
        <Select
          options={(node as EnumNode).descriptor.mapping.map((label, value) => ({ label, value }))}
          value={(node as EnumNode).value}
          onChange={(v) => ((node as EnumNode).updateValue(v), forceRender())}
        />
      );
    case 'INT':
      return (
        <InputNumber
          value={(node as IntNode).value}
          onChange={(v) => (
            (node as IntNode).updateValue(v === null ? (node as IntNode).descriptor.value : v), forceRender()
          )}
          max={(node as IntNode).descriptor.max}
          min={(node as IntNode).descriptor.min}
          step={1}
          precision={0}
        />
      );
    case 'FLOAT':
      return (
        <InputNumber
          value={(node as FloatNode).value}
          onChange={(v) => (
            (node as FloatNode).updateValue(v === null ? (node as FloatNode).descriptor.value : v), forceRender()
          )}
          max={(node as FloatNode).descriptor.max}
          min={(node as FloatNode).descriptor.min}
          step={10 ** -(node as FloatNode).descriptor.precision}
          precision={(node as FloatNode).descriptor.precision}
        />
      );
    case 'ENUM_ARRAY':
      return <TextInput textEntry={node as EnumArrayNode} placeholder={node.name} forceRender={forceRender} />;
    case 'OPTIONAL':
      return (
        <NodeWithChildrenUI
          node={node as OptionalNode}
          forceRender={forceRender}
          stateChange={
            <Checkbox
              checked={(node as OptionalNode).state}
              onChange={(v) => ((node as OptionalNode).updateState(v.target.checked), forceRender())}
            />
          }
          wrapper={wrapper}
        />
      );
    case 'ENUM_OPTIONS':
      return (
        <NodeWithChildrenUI
          node={node as EnumOptionsNode}
          forceRender={forceRender}
          stateChange={
            <Select
              options={(node as EnumOptionsNode).descriptor.mapping.map((d, i) => ({ label: d, value: i }))}
              value={(node as EnumOptionsNode).state}
              onChange={(v) => ((node as EnumOptionsNode).updateState(v), forceRender())}
            />
          }
          wrapper={wrapper}
        />
      );
    case 'ARRAY':
      return (
        <NodeWithChildrenUI
          node={node as ArrayNode}
          forceRender={forceRender}
          stateChange={
            <Select
              options={Array.from({
                length: (node as ArrayNode).descriptor.maxCount - (node as ArrayNode).descriptor.minCount
              }).map((_, i) => ({
                label: `#${i + (node as ArrayNode).descriptor.minCount}`,
                value: i + (node as ArrayNode).descriptor.minCount
              }))}
              value={(node as ArrayNode).state}
              onChange={(v) => ((node as ArrayNode).updateState(v), forceRender())}
            />
          }
          wrapper={wrapper}
        />
      );
    case 'OBJECT':
      return (
        <div style={{ display: 'grid', width: '100%', gridTemplateColumns: '1fr', gap: 4 }}>
          {node.getChildren().map((child) => (child === null ? nullContent : wrapper(child, forceRender)))}
        </div>
      );
  }
};
