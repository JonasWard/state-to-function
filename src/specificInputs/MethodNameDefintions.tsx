import React from 'react';
import { ArrayNode } from 'url-safe-bitpacking';
import { NamedInputsArrayEditor, NamedInputsChildrenType, SymbolNameType } from './NameEditor';
import { LispStyle } from '../Components/renderers/method/LispStyle';
import { Popover, Button } from 'antd';
import { SymbolRenderer } from '../Components/renderers/icon/SymbolRenderer';
import { TNodeUIProps } from '../nodeProps';

export const MethodInputsArray: React.FC<
  TNodeUIProps<ArrayNode> & {
    availableNumericInputs: SymbolNameType[];
    availableMethodInputs: SymbolNameType[];
  }
> = ({ node, forceRender, availableNumericInputs, availableMethodInputs }) => (
  <NamedInputsArrayEditor
    node={node}
    withSymbol
    name="Method Inputs"
    forceRender={forceRender}
    contentRenderer={(content, index, forceRender, children) => {
      const [symbol, subscript] = children as NamedInputsChildrenType;

      return (
        <Popover
          content={
            <LispStyle
              node={content}
              forceRender={forceRender}
              availableMethodInputs={availableMethodInputs.slice(0, index)}
              availableNumericInputs={availableNumericInputs}
            />
          }
        >
          <Button style={{ height: '4.2rem' }} children={<SymbolRenderer {...{ symbol, subscript }} />}></Button>
        </Popover>
      );
    }}
  />
);
