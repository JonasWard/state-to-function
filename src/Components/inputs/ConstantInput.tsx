import React from 'react';
import { NUMBER_CHARS } from '../../model/charsets';
import { parseConstant } from '../../model/numeric';
import { CharsetInput } from './CharsetInput';

const validate = (s: string) => (Number.isNaN(parseConstant(s)) ? 'Not a number' : null);

export const ConstantInput: React.FC<{
  value: string;
  onCommit: (value: string) => void;
  ariaLabel: string;
  className?: string;
}> = (props) => <CharsetInput {...props} charset={NUMBER_CHARS} validate={validate} placeholder="0" />;
