import React, { useMemo, useState } from 'react';
import { ArrayNode, EnumArrayNode, EnumNode, EnumOptionsNode, ObjectNode, VersionNode } from 'url-safe-bitpacking';
import { SpecificNodeUI } from './SpecificNodeUI';
import { Button } from 'antd';
import './reference-name.css';
import { PlusCircleFilled, DeleteFilled } from '@ant-design/icons';
import { TNodeUIProps } from '../nodeProps';
import { SymbolInputs } from '../Components/inputs/SymbolInputs';
import { useGlobalUIStore } from '../state/globalUIStore';
import { MethodFlatRenderer } from '../Components/renderers/method/MethodFlatRenderer';
import { useMethodStore } from '../state/methodStore';
import { SymbolNameType } from './NameEditor';

type NamedInputsChildrenType = [EnumNode, EnumArrayNode, EnumArrayNode, EnumOptionsNode];

const NamedInputsArrayEditor: React.FC<
  TNodeUIProps<ArrayNode> & {
    name: string;
    withSymbol?: boolean;
  }
> = ({ node, name, withSymbol = false, ...props }) => {
  const { numericInputNames, methodInputNames } = useMethodStore();
  const { isDesktop } = useGlobalUIStore();
  return (
    <div className={`input-column ${isDesktop ? 'desktop' : 'mobile'}`}>
      <span style={{ height: 32, display: 'flex', alignItems: 'center' }}>{name}</span>
      <div className={`method-input-content ${isDesktop ? 'desktop' : 'mobile'}`}>
        {node.getChildren().map((child, i) => (
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
  const { isDesktop } = useGlobalUIStore();
  const [inFocus, setInFocus] = useState<'method' | 'numeric'>('numeric');

  const [symbol, subscript, name, content] = useMemo(
    () => node.getChildren() as NamedInputsChildrenType,
    [node.bitstring]
  );

  return (
    <>
      <SymbolInputs key={`${index}-symbol`} symbol={symbol} forceRender={forceRender} subscript={subscript} />
      <div className="method-input-content cell">
        <div className="method-input-content name">
          <SpecificNodeUI key={`${index}-subscript`} node={subscript} forceRender={forceRender} />
          <SpecificNodeUI key={`${index}-name`} node={name} forceRender={forceRender} />
        </div>
        <MethodFlatRenderer node={content} forceRender={forceRender} {...props} />
      </div>
      <Button key={`${index}-button`} type="text" disabled={!canRemove} onClick={remove} style={{ width: 10 }}>
        <DeleteFilled />
      </Button>
    </>
  );
};

export const MethodAlgorithmDefinition: React.FC<TNodeUIProps<ArrayNode> & { forceRender: () => void }> = ({
  node,
  forceRender
}) => <NamedInputsArrayEditor node={node} name="Method Algorithm" forceRender={forceRender} />;
