import React from 'react';
import styles from './MathSymbol.module.css';
import { symbolLabel } from './symbolLabel';

export const MathSymbol: React.FC<{ symbol: string; subscript?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  symbol,
  subscript = '',
  size = 'md'
}) => (
  <var className={`${styles.symbol} ${styles[size]}`} aria-label={symbolLabel(symbol, subscript)}>
    {symbol}
    {subscript && <sub>{subscript}</sub>}
  </var>
);
