import { densing, fixed, int, schema, undensing } from 'densing';
import { clamp, FLOAT_PRECISION, normalizeRange, parseConstant, roundTo, toFloat, toInt } from './numeric';
import { AppletOverrides, Definition } from './types';

export interface AppletField {
  inputIndex: number;
  name: string;
  type: 'integer' | 'float';
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

const fieldCache = new WeakMap<Definition, AppletField[]>();
const schemaCache = new WeakMap<Definition, ReturnType<typeof schema>>();

/** One field per integer/float input, with an ordered, in-bounds range and a default inside it. */
export const getAppletFields = (def: Definition): AppletField[] => {
  const cached = fieldCache.get(def);
  if (cached) return cached;
  const fields = def.inputs.flatMap((input, inputIndex): AppletField[] => {
    const k = input.kind;
    if (k.type === 'constant') return [];
    const to = k.type === 'integer' ? toInt : toFloat;
    const [min, max] = normalizeRange(to(k.min), to(k.max));
    return [
      {
        inputIndex,
        name: `${k.type === 'integer' ? 'i' : 'f'}${inputIndex}`,
        type: k.type,
        min,
        max,
        step: k.type === 'integer' ? 1 : FLOAT_PRECISION,
        defaultValue: clamp(to(k.value), min, max)
      }
    ];
  });
  fieldCache.set(def, fields);
  return fields;
};

export const fitToField = (f: AppletField, v: number) =>
  f.type === 'integer' ? clamp(Math.round(v), f.min, f.max) : roundTo(clamp(v, f.min, f.max), FLOAT_PRECISION);

export const buildAppletSchema = (def: Definition) => {
  const cached = schemaCache.get(def);
  if (cached) return cached;
  const s = schema(
    ...getAppletFields(def).map((f) =>
      f.type === 'integer'
        ? int(f.name, f.min, f.max, f.defaultValue)
        : fixed(f.name, f.min, f.max, FLOAT_PRECISION, f.defaultValue)
    )
  );
  schemaCache.set(def, s);
  return s;
};

/** Value used for every input: the override, else the definition's default (constants are parsed). */
export const resolveInputValues = (def: Definition, overrides: AppletOverrides): number[] => {
  const byIndex = new Map(getAppletFields(def).map((f) => [f.inputIndex, f]));
  return def.inputs.map((input, i) => {
    if (input.kind.type === 'constant') return parseConstant(input.kind.value);
    const f = byIndex.get(i)!;
    const o = overrides[i];
    return o === null || o === undefined || !Number.isFinite(o) ? f.defaultValue : fitToField(f, o);
  });
};

/** Overrides aligned to the inputs, fitted into their range; null where unset or equal to the default. */
export const reconcileOverrides = (def: Definition, overrides: AppletOverrides): AppletOverrides => {
  const byIndex = new Map(getAppletFields(def).map((f) => [f.inputIndex, f]));
  return def.inputs.map((_, i) => {
    const f = byIndex.get(i);
    const o = overrides[i];
    if (!f || o === null || o === undefined || !Number.isFinite(o)) return null;
    const v = fitToField(f, o);
    return v === f.defaultValue ? null : v;
  });
};

export const encodeApplet = (def: Definition, overrides: AppletOverrides): string => {
  const fields = getAppletFields(def);
  if (!fields.some((f) => overrides[f.inputIndex] !== null && overrides[f.inputIndex] !== undefined)) return '';
  const values = resolveInputValues(def, overrides);
  return densing(buildAppletSchema(def), Object.fromEntries(fields.map((f) => [f.name, values[f.inputIndex]])));
};

export const decodeApplet = (def: Definition, s: string): { ok: boolean; overrides: AppletOverrides } => {
  const empty: AppletOverrides = def.inputs.map(() => null);
  if (!s) return { ok: true, overrides: empty };
  try {
    const data = undensing(buildAppletSchema(def), s) as Record<string, number>;
    const overrides = [...empty];
    for (const f of getAppletFields(def)) overrides[f.inputIndex] = data[f.name];
    return { ok: true, overrides: reconcileOverrides(def, overrides) };
  } catch {
    return { ok: false, overrides: empty };
  }
};
