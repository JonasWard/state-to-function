import { describe, expect, it } from 'vitest';
import { SYMBOL_CHARS } from './charsets';
import { DEFAULT_DEFINITION } from './defaults';
import { formatPieces, FormulaContext, GREEK_NAMES, labelText, parseFormula, parsePieces, Piece, piecesToText } from './formula';
import { OP_ARITY, OPS } from './operators';
import { Expr, Label, Operand } from './types';

const label = (symbol: string, subscript = '', name = ''): Label => ({ symbol, subscript, name });
const ctx: FormulaContext = {
  inputs: [label('l'), label('w'), label('h'), label('α'), label('x', 'a+b'), label('?')],
  methods: [label('A', 't'), label('A', 'f'), label('B')],
  later: [label('C'), label('D', '2')]
};
const inp = (index: number): Operand => ({ type: 'numericInput', index });
const out = (index: number): Operand => ({ type: 'methodOutput', index });
const num = (value: string): Operand => ({ type: 'hardcoded', value });
const m = (op: Expr['op'], ...values: Operand[]): Operand => ({ type: 'method', method: { op, values } });
const expr = (o: Operand) => (o as Extract<Operand, { type: 'method' }>).method;

const parsed = (text: string) => {
  const r = parseFormula(text, ctx);
  if (!r.ok) throw new Error(`${text}: ${r.message}`);
  return r.expr;
};
const error = (text: string) => {
  const r = parseFormula(text, ctx);
  if (r.ok) throw new Error(`${text} parsed`);
  return r;
};
const text = (e: Expr, c = ctx) => piecesToText(formatPieces(e, c), c);

describe('parsing', () => {
  it('follows precedence and associativity', () => {
    expect(parsed('l + w * h')).toEqual(expr(m('addition', inp(0), m('multiplication', inp(1), inp(2)))));
    expect(parsed('l + w + h')).toEqual(expr(m('addition', inp(0), inp(1), inp(2))));
    expect(parsed('l + w - h')).toEqual(expr(m('subtraction', m('addition', inp(0), inp(1)), inp(2))));
    expect(parsed('l - w + h')).toEqual(expr(m('addition', m('subtraction', inp(0), inp(1)), inp(2))));
    expect(parsed('l / w / h')).toEqual(expr(m('division', m('division', inp(0), inp(1)), inp(2))));
    expect(parsed('l ^ w ^ h')).toEqual(expr(m('power', inp(0), m('power', inp(1), inp(2)))));
    expect(parsed('-l ^ 2')).toEqual(expr(m('multiplication', num('-1'), m('power', inp(0), num('2')))));
    expect(parsed('(-2) ^ 2')).toEqual(expr(m('power', num('-2'), num('2'))));
    expect(parsed('l * -2')).toEqual(expr(m('multiplication', inp(0), num('-2'))));
  });

  it('keeps explicit brackets as nesting and drops redundant ones', () => {
    expect(parsed('l + (w + h)')).toEqual(expr(m('addition', inp(0), m('addition', inp(1), inp(2)))));
    expect(parsed('((l)) * (w)')).toEqual(expr(m('multiplication', inp(0), inp(1))));
    expect(parsed('(l * w)')).toEqual(expr(m('multiplication', inp(0), inp(1))));
  });

  it('reads references, Greek names, subscripts and ASCII or maths operators', () => {
    expect(parsed('=A_t × alpha − α ÷ x_{a+b}')).toEqual(
      expr(m('subtraction', m('multiplication', out(0), inp(3)), m('division', inp(3), inp(4))))
    );
    expect(parsed('? * B')).toEqual(expr(m('multiplication', inp(5), out(2))));
    expect(parsed('2e3 + .5')).toEqual(expr(m('addition', num('2e3'), num('.5'))));
  });

  it('reads IF with each comparison', () => {
    expect(parsed('IF(l < w, l, w)')).toEqual(expr(m('smallerThan', inp(0), inp(1), inp(0), inp(1))));
    expect(parsed('if(l + 1 > w, 2, IF(l == w, 3, 4))')).toEqual(
      expr(m('greaterThan', m('addition', inp(0), num('1')), inp(1), num('2'), m('equal', inp(0), inp(1), num('3'), num('4'))))
    );
    expect(parsed('IF(l = w, 1, 0) * 2')).toEqual(expr(m('multiplication', m('equal', inp(0), inp(1), num('1'), num('0')), num('2'))));
  });

  it('reads resolved references and reports slots', () => {
    const pieces: Piece[] = [{ kind: 'ref', ref: out(1) }, { kind: 'text', text: ' * ' }, { kind: 'ref', ref: inp(0) }];
    expect(parsePieces(pieces, ctx)).toEqual({ ok: true, expr: expr(m('multiplication', out(1), inp(0))) });
    const slot = parsePieces([{ kind: 'text', text: 'l * ' }, { kind: 'slot', name: 'if true' }], ctx);
    expect(slot).toMatchObject({ ok: false, message: 'Fill in ‹if true›', piece: 1 });
  });

  it('names every Greek symbol', () => {
    const greek = SYMBOL_CHARS.filter((c) => /\p{Script=Greek}/u.test(c));
    expect(new Set(Object.values(GREEK_NAMES))).toEqual(new Set(greek));
  });
});

describe('errors', () => {
  it.each([
    ['lw', 'Unknown name lw; use l * w', 0, 2],
    ['l * q', 'Unknown name q', 4, 5],
    ['l * C', "A method can't use its own result", 4, 5],
    ['l * D_2', 'D_2 comes after this method; only earlier results can be used', 4, 7],
    ['l', 'A method needs an operation, e.g. l * 2', 0, 1],
    ['l * ', 'The formula ends too early', 4, 4],
    ['(l * w', 'Expected ) instead of the end', 6, 6],
    ['l * w)', 'Unexpected )', 5, 6],
    ['l < w', 'Comparisons only work inside IF(a < b, then, else)', 2, 3],
    ['IF(l, 1, 2)', 'IF needs a comparison first, e.g. IF(l < w, l, w)', 4, 5],
    ['IF(l < w, 1)', 'Expected , and the value if false instead of )', 11, 12],
    ['l * #REF', 'This reference no longer exists', 4, 8],
    ['1+2+3+4+5+6+7+8+9', 'Add takes at most 8 terms; group some in brackets', 15, 16],
    ['l * 1e999', '1e999 is not a number that can be stored', 4, 9],
    ['l * x_{a', 'Missing } after the subscript', 5, 8],
    ['l * $', 'Unexpected $', 4, 5],
    ['', 'Type a formula, e.g. l * w', 0, 0]
  ])('%s', (input, message, from, to) => {
    expect(error(input)).toMatchObject({ message, from, to });
  });

  it('refuses an ambiguous label', () => {
    const dup = { ...ctx, methods: [...ctx.methods, label('l')] };
    expect(parseFormula('l * 2', dup)).toMatchObject({ ok: false, message: expect.stringContaining('more than one definition') });
  });
});

describe('printing', () => {
  it('prints the default methods', () => {
    const { inputs, methods } = DEFAULT_DEFINITION;
    expect(methods.map((d, i) => text(d.method, { inputs, methods: methods.slice(0, i) }))).toEqual([
      'l * w',
      'w * h',
      'l * h',
      '(A_t + A_f + A_s) * 2',
      'A_t * h'
    ]);
  });

  it('turns references into tokens, missing ones into #REF and empty constants into slots', () => {
    const e = expr(m('addition', inp(0), out(9), num('')));
    expect(formatPieces(e, ctx)).toEqual([
      { kind: 'ref', ref: inp(0) },
      { kind: 'text', text: ' + #REF + ' },
      { kind: 'slot', name: 'number' }
    ]);
  });

  it('types subscripts with braces only when needed', () => {
    expect(labelText(label('A', 't2'))).toBe('A_t2');
    expect(labelText(label('x', 'a+b'))).toBe('x_{a+b}');
    expect(labelText(label('x', 'α'))).toBe('x_{α}');
  });
});

describe('round trip', () => {
  // a small seeded generator of expressions the visual editor can build
  const rng = (seed: number) => () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  const random = rng(42);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(random() * list.length)];
  const constants = ['0', '2', '-3', '1.5', '100', '2e3', '.25', '-0.5'];
  const operand = (depth: number): Operand => {
    const r = random();
    if (depth < 3 && r < 0.25) return { type: 'method', method: gen(depth + 1) };
    if (r < 0.55) return inp(Math.floor(random() * ctx.inputs.length));
    if (r < 0.75) return out(Math.floor(random() * ctx.methods.length));
    return num(pick(constants));
  };
  const gen = (depth: number): Expr => {
    const op = pick(OPS);
    const { min, max } = OP_ARITY[op];
    const n = min + Math.floor(random() * (max - min + 1));
    return { op, values: Array.from({ length: n }, () => operand(depth)) };
  };

  it('parses every printed expression back to the same tree', () => {
    for (let i = 0; i < 200; i++) {
      const e = gen(0);
      expect(parsePieces(formatPieces(e, ctx), ctx)).toEqual({ ok: true, expr: e });
      expect(parseFormula(text(e), ctx)).toEqual({ ok: true, expr: e });
    }
  });
});
