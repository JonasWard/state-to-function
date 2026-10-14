import { normalizeDefinition } from '../model/codec';
import { reconcileOverrides } from '../model/appletSchema';
import { AppletOverrides, Definition, Expr, InputKind, Operand } from '../model/types';
import { InputNumber, MethodStateData, MethodType, methodInputType } from './legacyTypes';

const convertKind = ({ inputType: t }: InputNumber): InputKind => {
  switch (t.state) {
    case 'hardcoded':
      return { type: 'constant', value: t.inlineInput };
    case 'integer':
      return { type: 'integer', min: t.integerMin, value: t.integerValue, max: t.integerMax };
    case 'float':
      return { type: 'float', min: t.floatMin, value: t.floatValue, max: t.floatMax };
  }
};

const convertOperand = (o: methodInputType): Operand => {
  switch (o.state) {
    case 'hardcoded':
      return { type: 'hardcoded', value: o.inlineInput };
    case 'numericInput':
      return { type: 'numericInput', index: o.numericInput };
    case 'methodOutput':
      return { type: 'methodOutput', index: o.methodOutput };
    case 'method':
      return { type: 'method', method: convertExpr(o) };
  }
};

const convertExpr = ({ method }: Pick<MethodType, 'method'>): Expr => ({
  op: method.state,
  values: method.values.map(convertOperand)
});

/** Maps url-safe-bitpacking's plain state data onto the densing model. */
export const convertLegacyDefinition = (data: MethodStateData): Definition =>
  normalizeDefinition({
    inputs: data.inputValues.map((i) => ({ symbol: i.symbol, subscript: i.subscript, name: i.name, kind: convertKind(i) })),
    methods: data.methodValues.map((m) => ({ symbol: m.symbol, subscript: m.subscript, name: m.name, method: convertExpr(m) }))
  });

/** Old applet fields are named `f<inputIndex>` / `i<inputIndex>`. */
export const convertLegacyApplet = (def: Definition, data: Record<string, number>): AppletOverrides => {
  const overrides: AppletOverrides = def.inputs.map(() => null);
  for (const [key, value] of Object.entries(data)) {
    const index = Number(key.slice(1));
    if (Number.isInteger(index) && index < overrides.length) overrides[index] = value;
  }
  return reconcileOverrides(def, overrides);
};
