import React, { useMemo } from 'react';
import { ArrayNode, EnumArrayNode, EnumNode, EnumOptionsNode, ObjectNode } from 'url-safe-bitpacking';
import { SpecificNodeUI } from './SpecificNodeUI';
import { Button, Popover } from 'antd';
import './reference-name.css';
import { PlusCircleFilled, DeleteFilled, FunctionOutlined } from '@ant-design/icons';
import { TNodeUIProps } from '../../urlBitPacking/nodeProps';
import { SymbolInputs } from '../../Components/inputs/SymbolInputs';
import { useGlobalUIStore } from '../../state/globalUIStore';
import { MethodFlatRenderer } from '../renderers/MethodFlatRenderer';
import { useMethodStore } from '../../state/methodStore';
import { SymbolNameType } from './NameEditor';
import { MethodOptionsGrid } from '../renderers/MethodOptionsGrid';
import { ShortSymbol } from '../renderers/methodType';
import { IconTitle } from '../../Components/icon/IconTitle';

type NamedInputsChildrenType = [EnumNode, EnumArrayNode, EnumArrayNode, EnumOptionsNode];

const NamedInputsArrayEditor: React.FC<
  TNodeUIProps<ArrayNode> & {
    withSymbol?: boolean;
  }
> = ({ node, withSymbol = false, ...props }) => {
  const numericInputNames = useMethodStore((s) => s.numericInputNames);
  const methodInputNames = useMethodStore((s) => s.methodInputNames);
  const isDesktop = useGlobalUIStore((s) => s.isDesktop);

  const children = useMemo(() => node.getChildren(), [node.name, node.bitstring]);

  return (
    <div className={`input-column ${isDesktop ? 'desktop' : 'mobile'}`}>
      {isDesktop ? <IconTitle icon={<FunctionOutlined />} title="Method Definitions" size="medium" /> : null}
      <div className={`method-input-content ${isDesktop ? 'desktop' : 'mobile'}`}>
        {children.map((child, i) => (
          <MethodInputEditor
            node={child as ObjectNode}
            key={i}
            index={i}
            remove={() => node.canRemoveChild(i) && (node.removeChild(i), props.forceRender())}
            canRemove={node.canRemoveChild(i)}
            availableNumericInputs={numericInputNames}
            availableMethodInputs={methodInputNames.slice(0, i)}
            {...props}
          />
        ))}
        <span key="empty-0" />
        <span key="empty-1" />
        <Button
          type="text"
          style={{ width: 10, cursor: node.state >= node.descriptor.maxCount ? 'not-allowed' : 'pointer' }}
          disabled={node.state >= node.descriptor.maxCount}
          onClick={() => (node.updateState(node.state + 1), props.forceRender())}
        >
          <PlusCircleFilled />
        </Button>
      </div>
    </div>
  );
};

const MethodInputEditor: React.FC<
  TNodeUIProps<ObjectNode> & {
    index: number;
    canRemove: boolean;
    remove: () => void;
    availableNumericInputs: SymbolNameType[];
    availableMethodInputs: SymbolNameType[];
  }
> = ({ node, index, forceRender, remove, canRemove, ...props }) => {
  const hideNameAndSubscriptInInput = useGlobalUIStore((s) => s.hideNameAndSubscriptInInput);
  const [symbol, subscript, name, content] = useMemo(
    () => node.getChildren() as NamedInputsChildrenType,
    [node.bitstring]
  );

  return (
    <>
      <SymbolInputs key={`${index}-symbol`} symbol={symbol} forceRender={forceRender} subscript={subscript} />
      <div className="method-input-content cell">
        {!hideNameAndSubscriptInInput ? (
          <div className="method-input-content name">
            <SpecificNodeUI key={`${index}-subscript`} node={subscript} forceRender={forceRender} />
            <SpecificNodeUI key={`${index}-name`} node={name} forceRender={forceRender} />
          </div>
        ) : null}
        <Popover
          trigger="click"
          content={
            <MethodOptionsGrid
              values={content.descriptor.mapping.map((method) => ShortSymbol[method])}
              select={(i) => (content.updateState(i), forceRender())}
              activeName={`[${content.state}]`}
              parentName={'method'}
            />
          }
        >
          <span>
            <MethodFlatRenderer node={content} forceRender={forceRender} {...props} />
          </span>
        </Popover>
      </div>
      <Button
        key={`${index}-button`}
        type="text"
        disabled={!canRemove}
        onClick={remove}
        style={{ height: '100%', paddingLeft: 3, padding: 0 }}
      >
        <DeleteFilled />
      </Button>
    </>
  );
};

export const MethodAlgorithmDefinition: React.FC<TNodeUIProps<ArrayNode> & { forceRender: () => void }> = ({
  node,
  forceRender
}) => <NamedInputsArrayEditor node={node} forceRender={forceRender} />;
