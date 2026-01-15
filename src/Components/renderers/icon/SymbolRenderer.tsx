import { EnumArrayNode, EnumNode } from 'url-safe-bitpacking';
import { getText } from '../../lib/textHelpers';
import { IconRenderer } from './IconRenderer';
import React from 'react';

export type TSymbolProps = {
  symbol: EnumNode;
  subscript: EnumArrayNode;
  size?: string;
};

export const SymbolRenderer: React.FC<TSymbolProps> = ({ symbol, subscript, size }) => (
  <IconRenderer symbol={symbol.descriptor.mapping[symbol.value] as string} subscript={getText(subscript)} size={size} />
);
