import React, { useMemo } from 'react';
import { ObjectNode, VersionNode, ArrayNode } from 'url-safe-bitpacking';
import { MethodInputsArray } from './MethodNameDefintions';
import { NumericInputsArray } from './NumericInputDefinitions';
import { SymbolNameType } from './NameEditor';
import { TNodeUIProps } from '../nodeProps';
import { useMethodStore } from '../state/methodStore';

export const InputMethodsComponent: React.FC<TNodeUIProps<ObjectNode>> = ({ node, forceRender }) => {
  const { setNumericInputNames, setMethodInputNames } = useMethodStore();

  const [inputs, methods] = useMemo(() => {
    const [_version, inputs, methods] = node.getChildren() as [VersionNode, ArrayNode, ArrayNode];
    setNumericInputNames(inputs.getChildren().map((method) => method.getChildren() as SymbolNameType));
    setMethodInputNames(methods.getChildren().map((method) => method.getChildren() as SymbolNameType));
    return [inputs, methods];
  }, [node.bitstring]);

  return (
    <div>
      <NumericInputsArray node={inputs} forceRender={forceRender} />
      <MethodInputsArray node={methods} forceRender={forceRender} />
    </div>
  );
};
