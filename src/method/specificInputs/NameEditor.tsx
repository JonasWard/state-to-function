import { DeleteFilled, PlusCircleFilled } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React, { useMemo } from 'react';
import { ArrayNode, EnumArrayNode, EnumNode, EnumOptionsNode, ObjectNode, SpecificTypeNode } from 'url-safe-bitpacking';
import { SpecificNodeUI } from './SpecificNodeUI';
import { SymbolRenderer, TSymbolProps } from '../../Components/renderers/icon/SymbolRenderer';
import { TNodeUIProps } from '../../urlBitPacking/nodeProps';
import { useMethodStore } from '../../state/methodStore';
import { useGlobalUIStore } from '../../state/globalUIStore';

export type NamedInputsArrayContentRenderer = (
  node: EnumOptionsNode,
  index: number,
  forceRender: () => void,
  otherChildren: (SpecificTypeNode | null)[]
) => React.ReactNode;

export type NamedInputsChildrenType = [EnumNode, EnumArrayNode, EnumArrayNode, EnumOptionsNode];
export type SymbolNameType = [EnumNode, EnumArrayNode, EnumArrayNode];

export const NamedInputsArrayEditor: React.FC<
  TNodeUIProps<ArrayNode> & {
    name: string;
    withSymbol?: boolean;
    contentRenderer?: NamedInputsArrayContentRenderer;
  }
> = ({ node, name, withSymbol = false, ...props }) => {
  const { isDesktop } = useGlobalUIStore();
  return (
    <div className={`input-column ${isDesktop ? 'desktop' : 'mobile'}`}>
      <span style={{ height: 32, display: 'flex', alignItems: 'center' }}>{name}</span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `auto 1fr auto ${props.contentRenderer ? 'auto' : ''}`,
          gap: '8px 4px',
          alignItems: 'center'
        }}
      >
        {node.getChildren().map((child, i) => (
          <NameEditor
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
        {props.contentRenderer && <span key="empty-2" />}
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

const SymbolInputs: React.FC<
  TSymbolProps & {
    forceRender: () => void;
  }
> = ({ forceRender, ...props }) => (
  <Popover
    content={
      <div className="symbol-editor">
        {(props.symbol.descriptor.mapping as string[]).map((s, i) => (
          <span
            className={i === props.symbol.value ? 'symbol-boxes selected' : 'symbol-boxes'}
            onClick={() => (props.symbol.updateValue(i), forceRender())}
            key={i}
            children={s}
          />
        ))}
      </div>
    }
  >
    <span style={{ cursor: 'pointer', padding: 4 }}>
      <SymbolRenderer {...props} />
    </span>
  </Popover>
);

export const NameEditor: React.FC<
  TNodeUIProps<ObjectNode> & {
    index: number;
    canRemove: boolean;
    contentRenderer?: NamedInputsArrayContentRenderer;
    remove: () => void;
  }
> = ({ node, index, forceRender, remove, canRemove, contentRenderer }) => {
  const [symbol, subscript, name, content] = useMemo(
    () => node.getChildren() as NamedInputsChildrenType,
    [node.bitstring]
  );

  return (
    <>
      <SymbolInputs key={`${index}-symbol`} symbol={symbol} forceRender={forceRender} subscript={subscript} />
      <div key={`${index}-node`} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <SpecificNodeUI key={`${index}-name`} node={name} forceRender={forceRender} />
        <SpecificNodeUI key={`${index}-subscript`} node={subscript} forceRender={forceRender} />
      </div>
      {contentRenderer ? (
        <div key={`${index}-content`} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {contentRenderer(content, index, forceRender, [symbol, subscript, name])}
        </div>
      ) : null}
      <Button key={`${index}-button`} type="text" disabled={!canRemove} onClick={remove} style={{ width: 10 }}>
        <DeleteFilled />
      </Button>
    </>
  );
};
