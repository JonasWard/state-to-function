import { describe, expect, it } from 'vitest';
import { decodeApplet, encodeApplet, getAppletFields, reconcileOverrides, resolveInputValues } from './appletSchema';
import { DEFAULT_DEFINITION } from './defaults';
import { Definition, InputKind } from './types';

const withKinds = (...kinds: InputKind[]): Definition => ({
  inputs: kinds.map((kind, i) => ({ symbol: 'x', subscript: `${i}`, name: '', kind })),
  methods: []
});

describe('applet schema', () => {
  it('round-trips overrides', () => {
    const s = encodeApplet(DEFAULT_DEFINITION, [null, 250, null]);
    expect(s).not.toBe('');
    expect(decodeApplet(DEFAULT_DEFINITION, s)).toEqual({ ok: true, overrides: [null, 250, null] });
  });

  it('omits the segment without overrides', () => {
    expect(encodeApplet(DEFAULT_DEFINITION, [null, null, null])).toBe('');
    expect(decodeApplet(DEFAULT_DEFINITION, '')).toEqual({ ok: true, overrides: [null, null, null] });
  });

  it('orders inverted ranges and clamps the default', () => {
    const def = withKinds({ type: 'float', min: 10, value: 50, max: 2 });
    expect(getAppletFields(def)[0]).toMatchObject({ min: 2, max: 10, defaultValue: 10 });
    expect(decodeApplet(def, encodeApplet(def, [3.333]))).toEqual({ ok: true, overrides: [3.33] });
  });

  it('handles zero-width ranges and all-constant definitions', () => {
    const def = withKinds({ type: 'integer', min: 3, value: 3, max: 3 }, { type: 'float', min: 1, value: 1, max: 1 });
    expect(encodeApplet(def, [7, 9])).toBe('');
    const constants = withKinds({ type: 'constant', value: '2' });
    expect(encodeApplet(constants, [5])).toBe('');
    expect(resolveInputValues(constants, [5])).toEqual([2]);
  });

  it('falls back on a string that does not match the definition', () => {
    expect(decodeApplet(DEFAULT_DEFINITION, '!!!')).toEqual({ ok: false, overrides: [null, null, null] });
  });

  it('reconciles overrides with a changed definition', () => {
    const def = withKinds({ type: 'integer', min: 0, value: 1, max: 10 }, { type: 'constant', value: '1' });
    expect(reconcileOverrides(def, [99, 4, 5])).toEqual([10, null]);
    expect(reconcileOverrides(def, [1])).toEqual([null, null]);
  });

  it('uses 0 as a real value', () => {
    const def = withKinds({ type: 'float', min: -1, value: 1, max: 1 });
    expect(resolveInputValues(def, [0])).toEqual([0]);
  });
});
