import { describe, expect, it } from 'vitest';
import { FormulaContext } from '../../model/formula';
import { Label } from '../../model/types';
import { suggest } from './suggest';

const label = (symbol: string, subscript = '', name = ''): Label => ({ symbol, subscript, name });
const ctx: FormulaContext = {
  inputs: [label('l', '', 'length'), label('α', '', 'angle'), label('a', '', 'area')],
  methods: [label('A', 't', 'Area Top'), label('A', 'f', 'Area Front'), label('B', '', 'base')]
};
const names = (before: string) =>
  suggest(before, ctx)?.items.map((s) => (s.kind === 'if' ? 'IF' : `${s.label.symbol}${s.label.subscript}`));

describe('suggest', () => {
  it('matches how references are typed, exact case first', () => {
    expect(names('2 * A')).toEqual(['At', 'Af', 'a']);
    expect(names('A_f')).toEqual(['Af']);
    expect(suggest('l * A_', ctx)?.from).toBe(4);
  });

  it('matches Greek names and names', () => {
    expect(names('alp')).toEqual(['α']);
    expect(names('are')).toEqual(['a', 'At', 'Af']);
    expect(names('fro')).toEqual(['Af']);
  });

  it('offers IF', () => {
    expect(names('I')).toEqual(['IF']);
    expect(names('i')).toEqual(['IF']);
  });

  it('stays quiet outside a word, in numbers and without matches', () => {
    expect(suggest('l * ', ctx)).toBeNull();
    expect(suggest('2e', ctx)).toBeNull();
    expect(suggest('zz', ctx)).toBeNull();
  });
});
