import { describe, expect, it } from 'vitest';
import { resolveInputValues } from './appletSchema';
import { DEFAULT_DEFINITION } from './defaults';
import { evaluate } from './evaluate';
import { addInput, addMethod, changeKind, changeOperator, removeInput, removeMethod } from './ops';

const results = (def = DEFAULT_DEFINITION) => evaluate(def, resolveInputValues(def, []));

describe('ops', () => {
  it('picks unused symbols', () => {
    const m = addMethod(DEFAULT_DEFINITION).methods.at(-1)!;
    expect(m.symbol).toBe('B');
    expect(addInput(DEFAULT_DEFINITION).inputs.at(-1)!.symbol).toBe('x');
    let def = DEFAULT_DEFINITION;
    for (let i = 0; i < 26; i++) def = addMethod(def);
    expect(def.methods.at(-1)).toMatchObject({ symbol: 'B', subscript: '1' });
  });

  it('keeps results when removing a referenced input', () => {
    const def = removeInput(DEFAULT_DEFINITION, 1);
    expect(def.inputs.map((i) => i.symbol)).toEqual(['l', 'h']);
    expect(results(def)).toEqual(results());
    expect(removeInput({ ...DEFAULT_DEFINITION, inputs: [DEFAULT_DEFINITION.inputs[0]] }, 0).inputs).toHaveLength(1);
  });

  it('keeps results when removing a referenced method', () => {
    const def = removeMethod(DEFAULT_DEFINITION, 0);
    expect(def.methods).toHaveLength(4);
    expect(results(def)).toEqual(results().slice(1));
  });

  it('keeps the value across type changes', () => {
    const float = DEFAULT_DEFINITION.inputs[0].kind;
    const int = changeKind(float, 'integer');
    expect(int).toEqual({ type: 'integer', min: 5, value: 100, max: 511 });
    const constant = changeKind(int, 'constant');
    expect(constant).toEqual({ type: 'constant', value: '100' });
    expect(changeKind(constant, 'float')).toEqual({ type: 'float', min: 0, value: 100, max: 100 });
  });

  it('fits operands to the operator arity', () => {
    const e = DEFAULT_DEFINITION.methods[0].method;
    expect(changeOperator(e, 'equal').values).toHaveLength(4);
    expect(changeOperator(changeOperator(e, 'equal'), 'power').values).toEqual(e.values);
  });
});
