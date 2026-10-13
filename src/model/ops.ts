import { defaultOperand } from './defaults';
import { clamp, FLOAT_MAX, FLOAT_MIN, INT_MAX, INT_MIN, MAX_INPUTS, MAX_METHODS, parseConstant, toFloat, toInt } from './numeric';
import { Op, OP_ARITY } from './operators';
import { Definition, Expr, InputDef, InputKind, InputKindType, Label, MethodDef, Operand } from './types';

const INPUT_SYMBOLS = 'xyzabcdefghijklmnopqrstuvw';
const METHOD_SYMBOLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const labelKey = (l: Pick<Label, 'symbol' | 'subscript'>) => `${l.symbol}\u0000${l.subscript}`;

export const isDuplicateLabel = (def: Definition, label: Label) =>
  [...def.inputs, ...def.methods].filter((l) => labelKey(l) === labelKey(label)).length > 1;

/** First symbol of the pool not in use; once all are taken, the pool's first symbol with a free numeric subscript. */
export const nextFreeSymbol = (def: Definition, pool: string): Pick<Label, 'symbol' | 'subscript'> => {
  const used = new Set([...def.inputs, ...def.methods].map(labelKey));
  for (const symbol of pool) if (!used.has(labelKey({ symbol, subscript: '' }))) return { symbol, subscript: '' };
  for (let n = 1; ; n++)
    for (const symbol of pool)
      if (!used.has(labelKey({ symbol, subscript: `${n}` }))) return { symbol, subscript: `${n}` };
};

export const addInput = (def: Definition): Definition =>
  def.inputs.length >= MAX_INPUTS
    ? def
    : {
        ...def,
        inputs: [
          ...def.inputs,
          { ...nextFreeSymbol(def, INPUT_SYMBOLS), name: '', kind: { type: 'float', min: 0, value: 1, max: 10 } }
        ]
      };

export const addMethod = (def: Definition): Definition =>
  def.methods.length >= MAX_METHODS
    ? def
    : {
        ...def,
        methods: [
          ...def.methods,
          {
            ...nextFreeSymbol(def, METHOD_SYMBOLS),
            name: '',
            method: { op: 'addition', values: [defaultOperand(), defaultOperand()] }
          }
        ]
      };

export const mapOperands = (e: Expr, fn: (o: Operand) => Operand): Expr => ({
  op: e.op,
  values: e.values.map((o) => fn(o.type === 'method' ? { type: 'method', method: mapOperands(o.method, fn) } : o))
});

const mapMethods = (methods: MethodDef[], fn: (o: Operand) => Operand) =>
  methods.map((m) => ({ ...m, method: mapOperands(m.method, fn) }));

export const countReferences = (def: Definition, type: 'numericInput' | 'methodOutput', index: number) => {
  let n = 0;
  mapMethods(def.methods, (o) => {
    if (o.type === type && o.index === index) n++;
    return o;
  });
  return n;
};

const defaultValueString = (k: InputKind) => (k.type === 'constant' ? k.value : `${k.value}`);

/** Removes an input; references to it become its default value, later references shift down. */
export const removeInput = (def: Definition, index: number): Definition => {
  if (def.inputs.length <= 1) return def;
  const replacement: Operand = { type: 'hardcoded', value: defaultValueString(def.inputs[index].kind) };
  return {
    inputs: def.inputs.filter((_, i) => i !== index),
    methods: mapMethods(def.methods, (o) =>
      o.type !== 'numericInput' || o.index < index
        ? o
        : o.index === index
          ? replacement
          : { type: 'numericInput', index: o.index - 1 }
    )
  };
};

/** Removes a method; references to it are replaced by its expression, later references shift down. */
export const removeMethod = (def: Definition, index: number): Definition => {
  const inlined: Operand = { type: 'method', method: def.methods[index].method };
  return {
    inputs: def.inputs,
    methods: mapMethods(
      def.methods.filter((_, i) => i !== index),
      (o) =>
        o.type !== 'methodOutput' || o.index < index
          ? o
          : o.index === index
            ? inlined
            : { type: 'methodOutput', index: o.index - 1 }
    )
  };
};

/** Switches an input's type while keeping its value (and range, where it still fits). */
export const changeKind = (kind: InputKind, to: InputKindType): InputKind => {
  if (kind.type === to) return kind;
  const raw = kind.type === 'constant' ? parseConstant(kind.value) : kind.value;
  const v = Number.isFinite(raw) ? raw : 0;
  if (to === 'constant') return { type: 'constant', value: `${v}` };
  const [lo, hi] = to === 'integer' ? [INT_MIN, INT_MAX] : [FLOAT_MIN, FLOAT_MAX];
  const fit = to === 'integer' ? toInt : toFloat;
  const value = fit(clamp(v, lo, hi));
  const min = kind.type === 'constant' ? Math.min(0, value) : fit(kind.min);
  const max = kind.type === 'constant' ? Math.max(value, 100) : fit(kind.max);
  return { type: to, min: fit(min), value, max: fit(max) };
};

/** Changes the operator, padding or truncating the operands to the new arity. */
export const changeOperator = (e: Expr, op: Op): Expr => {
  const { min, max } = OP_ARITY[op];
  const values = e.values.slice(0, max);
  while (values.length < min) values.push(defaultOperand());
  return { op, values };
};

export const updateAt = <T>(list: T[], index: number, value: T): T[] => list.map((x, i) => (i === index ? value : x));

export const setInput = (def: Definition, index: number, input: InputDef): Definition => ({
  ...def,
  inputs: updateAt(def.inputs, index, input)
});

export const setMethod = (def: Definition, index: number, method: MethodDef): Definition => ({
  ...def,
  methods: updateAt(def.methods, index, method)
});
