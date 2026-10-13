/** Screen-reader text for a symbol with subscript, e.g. "A sub t". */
export const symbolLabel = (symbol: string, subscript: string) => (subscript ? `${symbol} sub ${subscript}` : symbol);
