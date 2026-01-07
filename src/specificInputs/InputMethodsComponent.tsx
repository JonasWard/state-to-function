import React, { useMemo, useState } from 'react';
import { ObjectNode, VersionNode, ArrayNode } from 'url-safe-bitpacking';
import { MethodInputsArray } from './MethodNameDefintions';
import { NumericInputDefinitions } from './NumericInputDefinitions';
import { SymbolNameType } from './NameEditor';
import { TNodeUIProps } from '../nodeProps';
import { useMethodStore } from '../state/methodStore';
import './inputmethods.css';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGlobalUIStore } from '../state/globalUIStore';
import { MethodAlgorithmDefinition } from './MethodAlgorithmDefinition';

export const InputMethodsComponent: React.FC<TNodeUIProps<ObjectNode>> = ({ node, forceRender }) => {
  const { setNumericInputNames, setMethodInputNames } = useMethodStore();
  const { isDesktop } = useGlobalUIStore();
  const [inFocus, setInFocus] = useState<'method' | 'numeric'>('numeric');

  const [inputs, methods] = useMemo(() => {
    const [_version, inputs, methods] = node.getChildren() as [VersionNode, ArrayNode, ArrayNode];
    setNumericInputNames(inputs.getChildren().map((method) => method.getChildren() as SymbolNameType));
    setMethodInputNames(methods.getChildren().map((method) => method.getChildren() as SymbolNameType));
    return [inputs, methods];
  }, [node.bitstring]);

  return (
    <>
      {!isDesktop && (
        <Button
          type="text"
          onClick={() => setInFocus(inFocus === 'method' ? 'numeric' : 'method')}
          className="arrow-button"
        >
          <ArrowLeftOutlined className={`arrow-icon ${inFocus === 'method' ? 'left' : 'right'}`} />
          {inFocus === 'method' ? 'Numeric Inputs' : 'Method Inputs'}
        </Button>
      )}
      <div className={`input-methods-component ${isDesktop ? 'desktop' : 'mobile'} ${inFocus}`}>
        <NumericInputDefinitions node={inputs} forceRender={forceRender} />
        <MethodAlgorithmDefinition node={methods} forceRender={forceRender} />
      </div>
    </>
  );
};
