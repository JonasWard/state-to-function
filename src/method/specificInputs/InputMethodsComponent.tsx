import React, { useMemo } from 'react';
import { ObjectNode, VersionNode, ArrayNode } from 'url-safe-bitpacking';
import { NumericInputDefinitions } from './NumericInputDefinitions';
import { SymbolNameType } from './NameEditor';
import { TNodeUIProps } from '../../urlBitPacking/nodeProps';
import { useMethodStore } from '../../state/methodStore';
import './inputmethods.css';
import { useGlobalUIStore } from '../../state/globalUIStore';
import { MethodAlgorithmDefinition } from './MethodAlgorithmDefinition';

export const InputMethodsComponent: React.FC<TNodeUIProps<ObjectNode>> = ({ node, forceRender }) => {
  const setNumericInputNames = useMethodStore((s) => s.setNumericInputNames);
  const setMethodInputNames = useMethodStore((s) => s.setMethodInputNames);
  const isDesktop = useGlobalUIStore((s) => s.isDesktop);
  const uiInFocus = useGlobalUIStore((s) => s.uiInFocus);

  const [inputs, methods] = useMemo(() => {
    const [_version, inputs, methods] = node.getChildren() as [VersionNode, ArrayNode, ArrayNode];
    setNumericInputNames(inputs.getChildren().map((method) => method.getChildren() as SymbolNameType));
    setMethodInputNames(methods.getChildren().map((method) => method.getChildren() as SymbolNameType));
    return [inputs, methods];
  }, [node.bitstring]);

  return (
    <>
      <div
        className={`input-methods-component ${isDesktop ? 'desktop' : 'mobile'} ${
          uiInFocus === 'method' ? 'method' : 'numeric'
        }`}
      >
        <NumericInputDefinitions node={inputs} forceRender={forceRender} />
        <MethodAlgorithmDefinition node={methods} forceRender={forceRender} />
      </div>
    </>
  );
};
