import { describe, expect, it } from 'vitest';
import { resolveInputValues } from './appletSchema';
import { DEFAULT_DEFINITION } from './defaults';
import { evaluate } from './evaluate';
import { Definition, Expr } from './types';

const run = (method: Expr, inputs: number[] = []) => {
  const def: Definition = {
    inputs: inputs.map((v) => ({ symbol: 'x', subscript: '', name: '', kind: { type: 'constant', value: `${v}` } })),
    methods: [{ symbol: 'A', subscript: '', name: '', method }]
  };
  return evaluate(def, inputs)[0];
};
const c = (value: string) => ({ type: 'hardcoded' as const, value });

describe('evaluate', () => {
  it('computes the default example', () => {
    expect(evaluate(DEFAULT_DEFINITION, resolveInputValues(DEFAULT_DEFINITION, []))).toEqual([
      10000, 10000, 10000, 60000, 1000000
    ]);
  });

  it('uses an applet value of 0', () => {
    const def: Definition = {
      ...DEFAULT_DEFINITION,
      inputs: DEFAULT_DEFINITION.inputs.map((i) => ({ ...i, kind: { type: 'float', min: 0, value: 100, max: 5000 } }))
    };
    expect(evaluate(def, resolveInputValues(def, [null, 0, null]))[0]).toBe(0);
  });

  it('handles each operator', () => {
    expect(run({ op: 'division', values: [c('1'), c('0')] })).toBe(Infinity);
    expect(run({ op: 'power', values: [c('2'), c('10')] })).toBe(1024);
    expect(run({ op: 'subtraction', values: [c('1e3'), c('-.5')] })).toBe(1000.5);
    expect(run({ op: 'smallerThan', values: [c('1'), c('2'), c('3'), c('4')] })).toBe(3);
    expect(run({ op: 'greaterThan', values: [c('1'), c('2'), c('3'), c('4')] })).toBe(4);
    expect(run({ op: 'equal', values: [c('2'), c('2'), c('3'), c('4')] })).toBe(3);
  });

  it('evaluates nested expressions', () => {
    const inner: Expr = { op: 'addition', values: [c('1'), c('2'), c('3')] };
    expect(run({ op: 'multiplication', values: [{ type: 'method', method: inner }, { type: 'numericInput', index: 0 }] }, [2])).toBe(12);
  });

  it('gives NaN for forward references, missing inputs and empty constants', () => {
    expect(run({ op: 'addition', values: [{ type: 'methodOutput', index: 0 }, c('1')] })).toBeNaN();
    expect(run({ op: 'addition', values: [{ type: 'numericInput', index: 5 }, c('1')] })).toBeNaN();
    expect(run({ op: 'addition', values: [c(''), c('1')] })).toBeNaN();
  });
});
