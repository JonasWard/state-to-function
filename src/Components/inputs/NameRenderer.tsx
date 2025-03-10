import React from 'react';
import { validDescriptors } from '../../modelDefinition/enums/chars';
import { TextArray } from '../../modelDefinition/types/version0.data.type';

export const NameRenderer: React.FC<{ nameIndexes: TextArray }> = ({ nameIndexes }) => (
  <span>
    {Object.values(nameIndexes.v)
      .map((i) => validDescriptors[i.c.value] ?? '💩')
      .join('')}
  </span>
);
