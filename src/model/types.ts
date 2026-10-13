import { Op } from './operators';

export type InputKind =
  | { type: 'constant'; value: string }
  | { type: 'integer'; min: number; value: number; max: number }
  | { type: 'float'; min: number; value: number; max: number };

export type InputKindType = InputKind['type'];
export type NumericKind = Exclude<InputKind, { type: 'constant' }>;

export interface Label {
  symbol: string;
  subscript: string;
  name: string;
}

export interface InputDef extends Label {
  kind: InputKind;
}

export type Operand =
  | { type: 'hardcoded'; value: string }
  | { type: 'numericInput'; index: number }
  | { type: 'methodOutput'; index: number }
  | { type: 'method'; method: Expr };

export type OperandType = Operand['type'];

export interface Expr {
  op: Op;
  values: Operand[];
}

export interface MethodDef extends Label {
  method: Expr;
}

export interface Definition {
  inputs: InputDef[];
  methods: MethodDef[];
}

/** Applet values aligned to `Definition.inputs`; null means "use the definition's default". */
export type AppletOverrides = (number | null)[];
