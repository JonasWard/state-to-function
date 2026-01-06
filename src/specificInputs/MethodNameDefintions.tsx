import React from 'react';
import { ArrayNode } from 'url-safe-bitpacking';
import { NamedInputsArrayEditor, NamedInputsChildrenType } from './NameEditor';
import { Button } from 'antd';
import { SymbolRenderer } from '../Components/renderers/icon/SymbolRenderer';
import { TNodeUIProps } from '../nodeProps';
import { useMethodStore } from '../state/methodStore';

export const MethodInputsArray: React.FC<TNodeUIProps<ArrayNode>> = (props) => {
  const { setMethodNode } = useMethodStore();

  return (
    <NamedInputsArrayEditor
      withSymbol
      name="Method Inputs"
      contentRenderer={(content, index, _forceRender, children) => {
        const [symbol, subscript] = children as NamedInputsChildrenType;

        return (
          <Button
            key={`${index}-button`}
            style={{ height: '4.2rem' }}
            onClick={() => setMethodNode(content, index)}
            children={<SymbolRenderer {...{ symbol, subscript }} />}
          />
        );
      }}
      {...props}
    />
  );
};
