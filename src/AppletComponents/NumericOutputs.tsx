import React from 'react';
import { useMethodData } from '../state/method';
import { SubscriptRenderer } from '../Components/inputs/SubscriptRenderer';
import { SymbolRenderer } from '../Components/inputs/SymbolRenderer';
import { AttributeNames } from '../modelDefinition/enums/attributeNames';
import { VersionODataType } from '../modelDefinition/types/version0.data.type';

export const NumericOutputs: React.FC<{ values: { [id: number]: number } }> = ({ values }) => {
  const methodData = useMethodData((s) => s.data) as VersionODataType;

  return (
    <div style={{ padding: 10, display: 'grid', gridTemplateColumns: 'auto auto 1fr', gap: 8, width: '100%', margin: 'auto', alignItems: 'center' }}>
      {Object.entries(values).map(([index, value]) => (
        <>
          <var>
            <SymbolRenderer
              symbol={methodData[AttributeNames.FunctionArray].v[Number(index)][AttributeNames.FunctionOutput][AttributeNames.NumericScientificSymbol].value}
            />
            <SubscriptRenderer
              subscriptIndexes={
                methodData[AttributeNames.FunctionArray].v[Number(index)][AttributeNames.FunctionOutput][AttributeNames.NumericScientificSubscript]
              }
            />
          </var>
          =<var>{value.toFixed(3)}</var>
        </>
      ))}
    </div>
  );
};
