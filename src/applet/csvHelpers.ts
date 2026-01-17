export interface CSVRowData {
  inputSymbol: string;
  inputValue: string | number;
  inputName: string;
  resultSymbol: string;
  resultValue: string | number;
  resultName: string;
}

/**
 * Combines symbol and subscript with underscore delimiter
 * @param symbol - The main symbol
 * @param subscript - Optional subscript
 * @returns Combined string (e.g., "x_1" or just "x" if no subscript)
 */
export const formatSymbolForCSV = (symbol: string, subscript: string): string => {
  return subscript ? `${symbol}_${subscript}` : symbol;
};

/**
 * Generates CSV content from input and result data
 * @param inputValues - Array of input values with symbol, subscript, name, and value
 * @param resultValues - Array of result values with symbol, subscript, name, and value
 * @returns CSV string with 6 columns
 */
export const generateCSV = (
  inputValues: Array<{
    symbol: string;
    subscript: string;
    name: string;
    value: number | string;
  }>,
  resultValues: Array<{
    symbol: string;
    subscript: string;
    name: string;
    value: number;
  }>
): string => {
  // Create header row
  const headers = ['Input Symbol', 'Input Value', 'Input Name', 'Result Symbol', 'Result Value', 'Result Name'];

  // Determine the maximum number of rows needed
  const maxRows = Math.max(inputValues.length, resultValues.length);

  // Build rows
  const rows: string[][] = [];

  for (let i = 0; i < maxRows; i++) {
    const input = inputValues[i];
    const result = resultValues[i];

    const row = [
      // Column 0: Input symbol_subscript
      input ? formatSymbolForCSV(input.symbol, input.subscript) : '',
      // Column 1: Input value
      input ? String(input.value) : '',
      // Column 2: Input name
      input ? input.name : '',
      // Column 3: Result symbol_subscript
      result ? formatSymbolForCSV(result.symbol, result.subscript) : '',
      // Column 4: Result value
      result ? String(result.value) : '',
      // Column 5: Result name
      result ? result.name : ''
    ];

    rows.push(row);
  }

  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCSVValue = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Convert to CSV string
  const csvLines = [headers.map(escapeCSVValue).join(','), ...rows.map((row) => row.map(escapeCSVValue).join(','))];

  return csvLines.join('\n');
};
