import React from 'react';
import { validScientificSubscriptDescriptors } from '../../modelDefinition/enums/chars';
import { TextArray } from '../../modelDefinition/types/version0.data.type';

export const SubscriptRenderer: React.FC<{ subscriptIndexes: TextArray }> = ({ subscriptIndexes }) => (
  <sub>
    {Object.values(subscriptIndexes.v)
      .map((i) => validScientificSubscriptDescriptors[i.c.value] ?? '💩')
      .join('')}
  </sub>
);
