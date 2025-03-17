import React from 'react';
import { getText } from '../../lib/helpers';
import { AttributeNames } from '../../modelDefinition/enums/attributeNames';
import { validDescriptors } from '../../modelDefinition/enums/chars';
import { MethodEntry } from '../../modelDefinition/types/version0.data.type';
import { SymbolRenderer } from '../inputs/SymbolRenderer';
import { SubscriptRenderer } from '../inputs/SubscriptRenderer';
import { Typography } from 'antd';

export const MethodTitle: React.FC<{ method: MethodEntry }> = ({ method }) => {
  const descriptionText = getText(method[AttributeNames.FunctionOutput][AttributeNames.NumericInputName].v, validDescriptors);

  return descriptionText != '' ? (
    <Typography.Text ellipsis>{descriptionText}</Typography.Text>
  ) : (
    <var>
      <SymbolRenderer symbol={method[AttributeNames.FunctionOutput][AttributeNames.NumericScientificSymbol].value} />
      <SubscriptRenderer subscriptIndexes={method[AttributeNames.FunctionOutput][AttributeNames.NumericScientificSubscript]} />
    </var>
  );
};
