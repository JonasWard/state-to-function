import React from 'react';
import { useMethodData } from '../state/method';
import { SubscriptRenderer } from '../Components/inputs/SubscriptRenderer';
import { SymbolRenderer } from '../Components/inputs/SymbolRenderer';
import { AttributeNames } from '../modelDefinition/enums/attributeNames';
import { VersionODataType } from '../modelDefinition/types/version0.data.type';

export const NumericOutputs: React.FC<{ values: { [id: number]: number } }> = ({ values }) => {
  const methodData = useMethodData((s) => s.data) as VersionODataType;

  return Object.entries(values).map(([index, value]) => (
    <>
      <var>
        <SymbolRenderer
          symbol={methodData[AttributeNames.FunctionArray].v[Number(index)][AttributeNames.FunctionOutput][AttributeNames.NumericScientificSymbol].value}
        />
        <SubscriptRenderer
          subscriptIndexes={methodData[AttributeNames.FunctionArray].v[Number(index)][AttributeNames.FunctionOutput][AttributeNames.NumericScientificSubscript]}
        />
      </var>
      <span>=</span>
      <var>{value.toFixed(3)}</var>
      <span />
    </>
  ));
};
