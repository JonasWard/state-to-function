import React from 'react';
import { validScientificSymbols } from '../../modelDefinition/enums/chars';

export const SymbolRenderer: React.FC<{ symbol: number }> = ({ symbol }) => validScientificSymbols[symbol] ?? '🚽';
