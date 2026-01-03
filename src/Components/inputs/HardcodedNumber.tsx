import { EnumArrayNode } from 'url-safe-bitpacking';
import { TNodeUIProps } from '../../nodeProps';
import { TextInput } from '../TextInput';
import React from 'react';

const numberValidation = (s: string) => {
  const number = Number(s);
  if (isNaN(number)) return 'Please enter a valid number';
  return null;
};

export const HardcodedNumber: React.FC<
  TNodeUIProps<EnumArrayNode> & {
    size?: 'small' | 'middle' | 'large';
    styleOverwrite?: { minWidth?: number; maxWidth?: number };
  }
> = (props) => <TextInput customValidation={numberValidation} textEntry={props.node} {...props} />;
