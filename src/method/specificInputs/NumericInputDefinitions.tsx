import React, { useMemo } from 'react';
import { ArrayNode, EnumArrayNode, EnumNode, EnumOptionsNode, ObjectNode } from 'url-safe-bitpacking';
import { SpecificNodeUI } from './SpecificNodeUI';
import { Button, Segmented, Select } from 'antd';
import './reference-name.css';
import { PlusCircleFilled, DeleteFilled, NumberOutlined } from '@ant-design/icons';
import { TNodeUIProps } from '../../urlBitPacking/nodeProps';
import { SymbolInputs } from '../../Components/inputs/SymbolInputs';
import { useGlobalUIStore } from '../../state/globalUIStore';
import { IconTitle } from '../../Components/icon/IconTitle';

type NamedInputsChildrenType = [EnumNode, EnumArrayNode, EnumArrayNode, EnumOptionsNode];

const NamedInputsArrayEditor: React.FC<
  TNodeUIProps<ArrayNode> & {
    withSymbol?: boolean;
  }
> = ({ node, withSymbol = false, ...props }) => {
  const isDesktop = useGlobalUIStore((s) => s.isDesktop);
  return (
    <div className={`input-column ${isDesktop ? 'desktop' : 'mobile'}`}>
      {isDesktop ? <IconTitle icon={<NumberOutlined />} title="Inputs" size="medium" /> : null}
      <div className={`numeric-input-content ${isDesktop ? 'desktop' : 'mobile'}`}>
        {node.getChildren().map((child, i) => (
          <NumericInputEditor
            node={child as ObjectNode}
            key={i}
            index={i}
            remove={() => node.canRemoveChild(i) && (node.removeChild(i), props.forceRender())}
            canRemove={node.canRemoveChild(i)}
            {...props}
          />
        ))}
        <span key="empty-0" />
        <span key="empty-1" />
        <span key="empty-2" />
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

const shortSymbol: Record<'hardcoded' | 'integer' | 'float' , string> = {
  hardcoded: '𝑐',
  integer: 'ℤ',
  float: 'ℝ'
};

const NumericInputEditor: React.FC<
  TNodeUIProps<ObjectNode> & {
    index: number;
    canRemove: boolean;
    remove: () => void;
  }
> = ({ node, index, forceRender, remove, canRemove }) => {
  const hideNameAndSubscriptInInput = useGlobalUIStore((s) => s.hideNameAndSubscriptInInput);
  const showAdditionalDefinitionInformation = useGlobalUIStore((s) => s.showAdditionalDefinitionInformation);

  const [symbol, subscript, name, content] = useMemo(
    () => node.getChildren() as NamedInputsChildrenType,
    [node.bitstring]
  );

  return (
    <>
      <SymbolInputs key={`${index}-symbol`} symbol={symbol} forceRender={forceRender} subscript={subscript} />
      <div className="numeric-input-content cell">
        {!hideNameAndSubscriptInInput ? (
          <SpecificNodeUI key={`${index}-subscript`} node={subscript} forceRender={forceRender} />
        ) : null}
        <Segmented
          size="middle"
          options={content.descriptor.mapping.map((d, i) => ({ label: shortSymbol[d], value: i }))}
          value={content.state}
          onChange={(v) => (content.updateState(v), forceRender())}
        />
      </div>
      <div className="numeric-input-content cell">
        {!hideNameAndSubscriptInInput ? (
          <SpecificNodeUI key={`${index}-name`} node={name} forceRender={forceRender} />
        ) : null}
        <div key="numeric-content" style={{ display: 'flex', flexDirection: 'row', gap: 4, width: '100%' }}>
          {content.getChildData()!.map((child, i) => (
            <SpecificNodeUI key={i} node={child!} forceRender={forceRender} />
          ))}
        </div>
        {content.descriptor.mapping[content.state] !== 'hardcoded' && showAdditionalDefinitionInformation ? (
          <div
            key="numeric-content-info"
            style={{
              fontSize: '0.8rem',
              textAlign: 'center',
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr auto 1fr',
              gap: 4,
              width: '100%'
            }}
          >
            <span>min</span>
            <span>{'≤'}</span>
            <span>default</span>
            <span>{'≤'}</span>
            <span>max</span>
          </div>
        ) : null}
      </div>
      <Button key={`${index}-button`} type="text" disabled={!canRemove} onClick={remove} style={{ width: 10 }}>
        <DeleteFilled />
      </Button>
    </>
  );
};

export const NumericInputDefinitions: React.FC<{ node: ArrayNode; forceRender: () => void }> = ({
  node,
  forceRender
}) => <NamedInputsArrayEditor node={node} forceRender={forceRender} />;
