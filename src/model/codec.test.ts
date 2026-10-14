import { describe, expect, it } from 'vitest';
import { densing } from 'densing';
import { formatQrUrl } from '../state/hash';
import { encodeApplet } from './appletSchema';
import { decodeDefinition, encodeDefinition, normalizeDefinition, peekVersion, QR_BASE } from './codec';
import { DEFINITION_SCHEMA } from './schema';
import { toWire } from './wire';
import { DEFAULT_DEFINITION } from './defaults';
import { OP_ARITY, OPS } from './operators';
import { Definition, Expr, Operand } from './types';
import { NAME_CHARS, SUBSCRIPT_CHARS, SYMBOL_CHARS } from './charsets';

// characters a QR code can store in alphanumeric mode
const QR_ALPHANUMERIC = /^[0-9A-Z $%*+\-./:]+$/;
const qrUrl = (def: string, applet: string) =>
  formatQrUrl('https://jonasward.github.io', '/state-to-function/', def, applet);

const OLD_INITIAL =
  'ABJQGhtgneloAfSCcQ-hIGACw2uxYUAPpBOIfQkCEBrYYInoaAH0gnEPoSAoAKaKaE9GnqwCECEAEVVs9FYujT1YBCFEACkl52JLRp6sAhAiAAVK1bQno09WARgwIMICRUBnprpaFSICI';

describe('codec', () => {
  it('round-trips the default definition', () => {
    const s = encodeDefinition(DEFAULT_DEFINITION);
    expect(decodeDefinition(s)).toEqual({ ok: true, definition: DEFAULT_DEFINITION });
  });

  it('freezes the wire format of the default definition', () => {
    expect(encodeDefinition(DEFAULT_DEFINITION)).toMatchInlineSnapshot(`"ARJQGTVE67-6AH0gnEPoSBgAqtPw6PQA-kE4h9CQIQGRQyJjh6AH0gnEPoSAoAKaAGe6zQwGUhAhABFUAiq18iGAgWyEKIAFJIDv3_oodUwQgRAAKARVa-UKnm1pGDAgwgJFQGLIe10OiICI"`);
  });

  it('reads versions', () => {
    expect(peekVersion(OLD_INITIAL)).toBe(0);
    expect(peekVersion(encodeDefinition(DEFAULT_DEFINITION))).toBe(1);
    expect(peekVersion('')).toBeNull();
    expect(peekVersion('A!')).toBeNull();
  });

  it('classifies undecodable strings', () => {
    expect(decodeDefinition(OLD_INITIAL)).toMatchObject({ ok: false, reason: 'legacy' });
    expect(decodeDefinition('Ag')).toMatchObject({ ok: false, reason: 'newer-version' });
    expect(decodeDefinition('AQ')).toMatchObject({ ok: false, reason: 'corrupt' });
    expect(decodeDefinition(encodeDefinition(DEFAULT_DEFINITION) + 'A')).toMatchObject({ ok: false, reason: 'corrupt' });
    expect(decodeDefinition('a')).toMatchObject({ ok: false, reason: 'corrupt' });
  });

  it('normalizes values that densing would reject', () => {
    const def: Definition = {
      inputs: [
        { symbol: 'x', subscript: 'Ünï', name: 'a'.repeat(40), kind: { type: 'float', min: 5.004, value: 1e9, max: 2 } }
      ],
      methods: []
    };
    const decoded = decodeDefinition(encodeDefinition(def));
    expect(decoded).toEqual({
      ok: true,
      definition: {
        inputs: [{ symbol: 'x', subscript: 'n', name: 'a'.repeat(31), kind: { type: 'float', min: 5, value: 5242.87, max: 2 } }],
        methods: []
      }
    });
  });

  it('round-trips random definitions', () => {
    let seed = 42;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
    const pick = <T>(a: readonly T[]) => a[Math.floor(rnd() * a.length)];
    const text = (chars: string[]) => Array.from({ length: Math.floor(rnd() * 8) }, () => pick(chars)).join('');
    const num = () => (rnd() - 0.5) * 20000;
    const operand = (depth: number): Operand => {
      const t = pick(['hardcoded', 'numericInput', 'methodOutput', 'method'] as const);
      if (t === 'method' && depth < 3) return { type: 'method', method: expr(depth + 1) };
      if (t === 'numericInput' || t === 'methodOutput') return { type: t, index: Math.floor(rnd() * 40) };
      return { type: 'hardcoded', value: `${Math.round(num())}` };
    };
    const expr = (depth: number): Expr => {
      const op = pick(OPS);
      const n = OP_ARITY[op].min + Math.floor(rnd() * (OP_ARITY[op].max - OP_ARITY[op].min + 1));
      return { op, values: Array.from({ length: n }, () => operand(depth)) };
    };
    for (let i = 0; i < 200; i++) {
      const def: Definition = {
        inputs: Array.from({ length: 1 + Math.floor(rnd() * 5) }, () => ({
          symbol: pick(SYMBOL_CHARS),
          subscript: text(SUBSCRIPT_CHARS),
          name: text(NAME_CHARS),
          kind: pick([
            { type: 'constant', value: `${num()}`.slice(0, 12) },
            { type: 'integer', min: num(), value: num(), max: num() },
            { type: 'float', min: num(), value: num(), max: num() }
          ] as const)
        })),
        methods: Array.from({ length: Math.floor(rnd() * 5) }, () => ({
          symbol: pick(SYMBOL_CHARS),
          subscript: text(SUBSCRIPT_CHARS),
          name: text(NAME_CHARS),
          method: expr(0)
        }))
      };
      const s = encodeDefinition(def);
      expect(decodeDefinition(s)).toEqual({ ok: true, definition: normalizeDefinition(def) });
      const qr = encodeDefinition(def, QR_BASE);
      expect(decodeDefinition(qr, QR_BASE)).toEqual({ ok: true, definition: normalizeDefinition(def) });
      const overrides = def.inputs.map((_, j) => (j === 0 ? num() : null));
      expect(qrUrl(qr, encodeApplet(normalizeDefinition(def), overrides, QR_BASE))).toMatch(QR_ALPHANUMERIC);
    }
  });

  it('encodes QR links in the QR alphanumeric set', () => {
    const qr = encodeDefinition(DEFAULT_DEFINITION, QR_BASE);
    expect(decodeDefinition(qr, QR_BASE)).toEqual({ ok: true, definition: DEFAULT_DEFINITION });
    expect(qrUrl(qr, encodeApplet(DEFAULT_DEFINITION, [null, 250, null], QR_BASE))).toMatch(QR_ALPHANUMERIC);
    const newer = densing(DEFINITION_SCHEMA, { ...toWire(DEFAULT_DEFINITION), version: 2 }, QR_BASE);
    expect(decodeDefinition(newer, QR_BASE)).toMatchObject({ ok: false, reason: 'newer-version' });
    expect(decodeDefinition('NOT-A-LINK', QR_BASE)).toMatchObject({ ok: false, reason: 'corrupt' });
    expect(decodeDefinition(encodeDefinition(DEFAULT_DEFINITION), QR_BASE)).toMatchObject({ ok: false });
  });
});
