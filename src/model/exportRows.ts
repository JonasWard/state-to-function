import { Definition, Label } from './types';

export interface ExportRow extends Label {
  value: number;
}

/** Rows for CSV/PDF export: the applet's variable inputs and every method result. */
export const buildExportRows = (def: Definition, inputValues: number[], results: number[]) => ({
  inputs: def.inputs.flatMap(({ symbol, subscript, name, kind }, i): ExportRow[] =>
    kind.type === 'constant' ? [] : [{ symbol, subscript, name, value: inputValues[i] }]
  ),
  results: def.methods.map(({ symbol, subscript, name }, i): ExportRow => ({ symbol, subscript, name, value: results[i] }))
});
