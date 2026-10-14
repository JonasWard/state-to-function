import { parseConstant } from './numeric';
import { Op } from './operators';
import { Definition, Expr, Operand } from './types';

const apply = (op: Op, v: number[]): number => {
  switch (op) {
    case 'addition':
      return v.reduce((a, b) => a + b, 0);
    case 'multiplication':
      return v.reduce((a, b) => a * b, 1);
    case 'subtraction':
      return v[0] - v[1];
    case 'division':
      return v[0] / v[1];
    case 'power':
      return v[0] ** v[1];
    case 'smallerThan':
      return v[0] < v[1] ? v[2] : v[3];
    case 'greaterThan':
      return v[0] > v[1] ? v[2] : v[3];
    case 'equal':
      return v[0] === v[1] ? v[2] : v[3];
  }
};

/** Evaluates every method in order. A method can only read outputs of methods defined before it. */
export const evaluate = (def: Definition, inputValues: number[]): number[] => {
  const results: number[] = [];
  const operand = (o: Operand): number => {
    switch (o.type) {
      case 'hardcoded':
        return parseConstant(o.value);
      case 'numericInput':
        return inputValues[o.index] ?? NaN;
      case 'methodOutput':
        return results[o.index] ?? NaN;
      case 'method':
        return expr(o.method);
    }
  };
  const expr = (e: Expr): number => apply(e.op, e.values.map(operand));
  for (const m of def.methods) results.push(expr(m.method));
  return results;
};
