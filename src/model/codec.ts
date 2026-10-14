import { densing, undensing } from 'densing';
import { NAME_CHARS, NUMBER_CHARS, SUBSCRIPT_CHARS, SYMBOL_CHARS, sanitize } from './charsets';
import { defaultOperand } from './defaults';
import { MAX_INPUTS, MAX_METHODS, toFloat, toInt } from './numeric';
import { OP_ARITY, OPS } from './operators';
import { DEFINITION_SCHEMA, DEFINITION_VERSION } from './schema';
import { Definition, Expr, InputDef, InputKind, Label, Operand } from './types';
import { fromWire, toWire, WireDefinition } from './wire';

const BASE64URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/** Reads the leading 8-bit version field. url-safe-bitpacking links start with VERSION(0, 8 bits) and read as 0. */
export const peekVersion = (s: string): number | null => {
  if (s.length < 2) return null;
  const [a, b] = [BASE64URL.indexOf(s[0]), BASE64URL.indexOf(s[1])];
  if (a < 0 || b < 0) return null;
  return (a << 2) | (b >> 4);
};

export type DecodeResult =
  | { ok: true; definition: Definition }
  | { ok: false; reason: 'legacy' | 'newer-version' | 'corrupt'; error?: unknown };

const normalizeLabel = (l: Label): Label => ({
  symbol: SYMBOL_CHARS.includes(l.symbol) ? l.symbol : '?',
  subscript: sanitize(l.subscript, SUBSCRIPT_CHARS),
  name: sanitize(l.name, NAME_CHARS)
});

const normalizeKind = (k: InputKind): InputKind => {
  if (k.type === 'constant') return { type: 'constant', value: sanitize(k.value, NUMBER_CHARS) };
  const to = k.type === 'integer' ? toInt : toFloat;
  return { type: k.type, min: to(k.min), value: to(k.value), max: to(k.max) };
};

const normalizeOperand = (o: Operand): Operand => {
  switch (o.type) {
    case 'hardcoded':
      return { type: 'hardcoded', value: sanitize(o.value, NUMBER_CHARS) };
    case 'numericInput':
      return { type: 'numericInput', index: Math.min(Math.max(0, Math.round(o.index)), MAX_INPUTS - 1) };
    case 'methodOutput':
      return { type: 'methodOutput', index: Math.min(Math.max(0, Math.round(o.index)), MAX_METHODS - 1) };
    case 'method':
      return { type: 'method', method: normalizeExpr(o.method) };
  }
};

export const normalizeExpr = (e: Expr): Expr => {
  const op = OPS.includes(e.op) ? e.op : 'addition';
  const { min, max } = OP_ARITY[op];
  const values = e.values.slice(0, max).map(normalizeOperand);
  while (values.length < min) values.push(defaultOperand());
  return { op, values };
};

/** Brings a definition inside the schema's bounds so encoding cannot throw. */
export const normalizeDefinition = (def: Definition): Definition => {
  const inputs: InputDef[] = def.inputs
    .slice(0, MAX_INPUTS)
    .map((i) => ({ ...normalizeLabel(i), kind: normalizeKind(i.kind) }));
  if (!inputs.length) inputs.push({ symbol: 'x', subscript: '', name: '', kind: { type: 'constant', value: '0' } });
  return {
    inputs,
    methods: def.methods.slice(0, MAX_METHODS).map((m) => ({ ...normalizeLabel(m), method: normalizeExpr(m.method) }))
  };
};

export const encodeDefinition = (def: Definition): string =>
  densing(DEFINITION_SCHEMA, toWire(normalizeDefinition(def)));

export const decodeDefinition = (s: string): DecodeResult => {
  const version = peekVersion(s);
  if (version === null) return { ok: false, reason: 'corrupt' };
  if (version === 0) return { ok: false, reason: 'legacy' };
  if (version > DEFINITION_VERSION) return { ok: false, reason: 'newer-version' };
  try {
    return { ok: true, definition: fromWire(undensing(DEFINITION_SCHEMA, s) as WireDefinition) };
  } catch (error) {
    return { ok: false, reason: 'corrupt', error };
  }
};

