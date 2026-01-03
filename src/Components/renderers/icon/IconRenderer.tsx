import React from 'react';

const defaultSize = '1.8rem';

const SymbolRenderer: React.FC<{ symbol: string; size?: string }> = ({ symbol, size = defaultSize }) => (
  <var style={{ fontSize: size }}>{symbol}</var>
);
const SubscriptRenderer: React.FC<{ subscript: string; size?: string }> = ({ subscript, size = defaultSize }) => (
  <sub style={{ fontSize: size }}>{subscript}</sub>
);

export const IconRenderer: React.FC<{ symbol: string; subscript: string; size?: string }> = ({
  symbol,
  subscript,
  size
}) => (
  <span>
    <SymbolRenderer symbol={symbol} size={size} />
    <SubscriptRenderer subscript={subscript} size={size} />
  </span>
);
