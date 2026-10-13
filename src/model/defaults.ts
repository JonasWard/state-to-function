import { Definition, Operand } from './types';

const input = (index: number): Operand => ({ type: 'numericInput', index });
const output = (index: number): Operand => ({ type: 'methodOutput', index });
const box = (symbol: string, name: string) => ({
  symbol,
  subscript: '',
  name,
  kind: { type: 'float' as const, min: 5, value: 100, max: 5000 }
});

/** A box: three dimensions, its face areas, total surface and volume. */
export const DEFAULT_DEFINITION: Definition = {
  inputs: [box('l', 'length'), box('w', 'width'), box('h', 'height')],
  methods: [
    { symbol: 'A', subscript: 't', name: 'Area Top', method: { op: 'multiplication', values: [input(0), input(1)] } },
    { symbol: 'A', subscript: 'f', name: 'Area Front', method: { op: 'multiplication', values: [input(1), input(2)] } },
    { symbol: 'A', subscript: 's', name: 'Area Side', method: { op: 'multiplication', values: [input(0), input(2)] } },
    {
      symbol: 'A',
      subscript: '',
      name: 'Area Total',
      method: {
        op: 'multiplication',
        values: [
          { type: 'method', method: { op: 'addition', values: [output(0), output(1), output(2)] } },
          { type: 'hardcoded', value: '2' }
        ]
      }
    },
    { symbol: 'V', subscript: '', name: 'Volume', method: { op: 'multiplication', values: [output(0), input(2)] } }
  ]
};

export const defaultOperand = (): Operand => ({ type: 'hardcoded', value: '0' });
