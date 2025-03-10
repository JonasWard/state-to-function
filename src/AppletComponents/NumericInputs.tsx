import React from 'react';
import { useAppletData } from '../state/applet';
import { useMethodData } from '../state/method';
import { SubscriptRenderer } from '../Components/inputs/SubscriptRenderer';
import { SymbolRenderer } from '../Components/inputs/SymbolRenderer';
import { AttributeNames } from '../modelDefinition/enums/attributeNames';
import { FloatDataEntryRenderer } from '../Components/parametrics/dataentryrenderers/FloatDataEntryRenderer';
import { VersionODataType } from '../modelDefinition/types/version0.data.type';
import { NameRenderer } from '../Components/inputs/NameRenderer';

export const NumericInputs: React.FC = () => {
  const data = useAppletData((s) => s.data);
  const methodData = useMethodData((s) => s.data) as VersionODataType;

  return (
    <div style={{ padding: 10, display: 'grid', gridTemplateColumns: 'auto auto 1fr auto', gap: 8, width: '100%', margin: 'auto', alignItems: 'center' }}>
      {Object.entries(data)
        .filter(([a]) => a !== AttributeNames.Version && !methodData[AttributeNames.NumericInputs].v[Number(a)][AttributeNames.Hardcoded].value)
        .map(([index, inputValue]) => (
          <>
            <var>
              <SymbolRenderer symbol={methodData[AttributeNames.NumericInputs].v[Number(index)][AttributeNames.NumericScientificSymbol].value} />
              <SubscriptRenderer subscriptIndexes={methodData[AttributeNames.NumericInputs].v[Number(index)][AttributeNames.NumericScientificSubscript]} />
            </var>
            =
            <FloatDataEntryRenderer
              float={inputValue[AttributeNames.NumericInputValue]}
              onChange={(dataEntry) => useAppletData.getState().updateDataEntry(dataEntry)}
            />
            <NameRenderer nameIndexes={methodData[AttributeNames.NumericInputs].v[Number(index)][AttributeNames.NumericInputName]} />
          </>
        ))}
    </div>
  );
};
