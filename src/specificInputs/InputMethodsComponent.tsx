import React, { useMemo } from 'react';
import { ObjectNode, VersionNode, ArrayNode } from 'url-safe-bitpacking';
import { MethodInputsArray } from './MethodNameDefintions';
import { NumericInputsArray } from './NumericInputDefinitions';
import { SymbolNameType } from './NameEditor';
import { TNodeUIProps } from '../nodeProps';

export const InputMethodsComponent: React.FC<TNodeUIProps<ObjectNode>> = ({ node, forceRender }) => {
  const [_version, inputs, methods] = useMemo(
    () => node.getChildren() as [VersionNode, ArrayNode, ArrayNode],
    [node.bitstring]
  );

  const numericInputNames = useMemo(
    () => inputs.getChildren().map((method) => method.getChildren() as SymbolNameType),
    [inputs.bitstring]
  );

  const methodInputNames = useMemo(
    () => methods.getChildren().map((method) => method.getChildren() as SymbolNameType),
    [methods.bitstring]
  );

  return (
    <div>
      <NumericInputsArray node={inputs} forceRender={forceRender} />
      <MethodInputsArray
        node={methods}
        forceRender={forceRender}
        availableNumericInputs={numericInputNames}
        availableMethodInputs={methodInputNames}
      />
    </div>
  );
};
