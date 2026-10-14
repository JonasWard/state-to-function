import { fromChars, toChars } from './charsets';
import { DEFINITION_VERSION } from './schema';
import { Definition, Expr, InputKind, Label, Operand } from './types';

type WireLabel = { symbol: string; subscript: string[]; name: string[] };
type WireKind = Exclude<InputKind, { type: 'constant' }> | { type: 'constant'; value: string[] };
type WireOperand =
  | { type: 'hardcoded'; value: string[] }
  | Extract<Operand, { type: 'numericInput' | 'methodOutput' }>
  | { type: 'method'; method: WireExpr };
type WireExpr = { op: Expr['op']; values: WireOperand[] };

export interface WireDefinition {
  version: number;
  inputs: (WireLabel & { kind: WireKind })[];
  methods: (WireLabel & { method: WireExpr })[];
}

const labelToWire = ({ symbol, subscript, name }: Label): WireLabel => ({
  symbol,
  subscript: toChars(subscript),
  name: toChars(name)
});
const labelFromWire = ({ symbol, subscript, name }: WireLabel): Label => ({
  symbol,
  subscript: fromChars(subscript),
  name: fromChars(name)
});

const operandToWire = (o: Operand): WireOperand =>
  o.type === 'hardcoded'
    ? { type: 'hardcoded', value: toChars(o.value) }
    : o.type === 'method'
      ? { type: 'method', method: exprToWire(o.method) }
      : o;
const exprToWire = (e: Expr): WireExpr => ({ op: e.op, values: e.values.map(operandToWire) });

const operandFromWire = (o: WireOperand): Operand =>
  o.type === 'hardcoded'
    ? { type: 'hardcoded', value: fromChars(o.value) }
    : o.type === 'method'
      ? { type: 'method', method: exprFromWire(o.method) }
      : { type: o.type, index: o.index };
const exprFromWire = (e: WireExpr): Expr => ({ op: e.op, values: e.values.map(operandFromWire) });

export const toWire = (def: Definition): WireDefinition => ({
  version: DEFINITION_VERSION,
  inputs: def.inputs.map((i) => ({
    ...labelToWire(i),
    kind: i.kind.type === 'constant' ? { type: 'constant', value: toChars(i.kind.value) } : i.kind
  })),
  methods: def.methods.map((m) => ({ ...labelToWire(m), method: exprToWire(m.method) }))
});

export const fromWire = (w: WireDefinition): Definition => ({
  inputs: w.inputs.map((i) => ({
    ...labelFromWire(i),
    kind:
      i.kind.type === 'constant'
        ? { type: 'constant', value: fromChars(i.kind.value) }
        : { type: i.kind.type, min: i.kind.min, value: i.kind.value, max: i.kind.max }
  })),
  methods: w.methods.map((m) => ({ ...labelFromWire(m), method: exprFromWire(m.method) }))
});
