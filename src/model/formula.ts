// Formulas as text: methods typed like spreadsheet formulas, e.g. `(A_t + A_f) * 2` or `IF(l < w, l, w)`.
// The editor works on pieces: plain text, already-resolved references (shown as tokens) and unfilled slots.
import { NUMBER_CHARS, SYMBOL_CHARS } from './charsets';
import { parseConstant } from './numeric';
import { isConditional, Op, OP_ARITY, OP_LABEL } from './operators';
import { Expr, Label, Operand } from './types';

export type RefOperand = Extract<Operand, { index: number }>;

export type Piece = { kind: 'text'; text: string } | { kind: 'ref'; ref: RefOperand } | { kind: 'slot'; name: string };

export interface FormulaContext {
  inputs: Label[];
  /** the methods defined before the one being edited */
  methods: Label[];
  /** the method being edited and those after it, for a clearer error when one is referenced */
  later?: Label[];
}

export type ParseResult =
  | { ok: true; expr: Expr }
  | { ok: false; message: string; piece: number; from: number; to: number };

/** Greek letters typed by name; covers every Greek symbol in `SYMBOL_CHARS`. */
export const GREEK_NAMES: Record<string, string> = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  Gamma: 'Γ',
  delta: 'δ',
  Delta: 'Δ',
  epsilon: 'ε',
  zeta: 'ζ',
  eta: 'η',
  Theta: 'Θ',
  lambda: 'λ',
  mu: 'μ',
  nu: 'ν',
  xi: 'ξ',
  pi: 'π',
  Pi: 'Π',
  rho: 'ρ',
  sigma: 'σ',
  Sigma: 'Σ',
  varsigma: 'ς',
  tau: 'τ',
  phi: 'φ',
  Phi: 'Φ',
  chi: 'χ',
  psi: 'ψ',
  omega: 'ω',
  Omega: 'Ω'
};

const SIMPLE_SUBSCRIPT = /^[a-z0-9]+$/;
const NUMBER = /^(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/;
const VALID_CONSTANT = /^-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?$/;

/** How a label is typed: `A_t`, or `A_{a+b}` when the subscript holds more than letters and digits. */
export const labelText = ({ symbol, subscript }: Pick<Label, 'symbol' | 'subscript'>) =>
  !subscript ? symbol : SIMPLE_SUBSCRIPT.test(subscript) ? `${symbol}_${subscript}` : `${symbol}_{${subscript}}`;

export const refLabel = (ref: RefOperand, ctx: FormulaContext): Label | undefined =>
  (ref.type === 'numericInput' ? ctx.inputs : ctx.methods)[ref.index];

// ---------------------------------------------------------------------------------------------- printing

const ASCII_OP: Record<Op, string> = {
  addition: '+',
  multiplication: '*',
  subtraction: '-',
  division: '/',
  power: '^',
  smallerThan: '<',
  greaterThan: '>',
  equal: '='
};

class PieceWriter {
  pieces: Piece[] = [];
  text(t: string) {
    const last = this.pieces[this.pieces.length - 1];
    if (last?.kind === 'text') last.text += t;
    else this.pieces.push({ kind: 'text', text: t });
  }
  push(p: Piece) {
    this.pieces.push(p);
  }
}

const writeOperand = (w: PieceWriter, o: Operand, ctx: FormulaContext, bracket: boolean) => {
  switch (o.type) {
    case 'hardcoded':
      // an empty or malformed constant (it evaluates to NaN) becomes a slot to fill in
      if (!VALID_CONSTANT.test(o.value)) return w.push({ kind: 'slot', name: 'number' });
      return w.text(bracket && o.value.startsWith('-') ? `(${o.value})` : o.value);
    case 'numericInput':
    case 'methodOutput':
      return refLabel(o, ctx) ? w.push({ kind: 'ref', ref: { type: o.type, index: o.index } }) : w.text('#REF');
    case 'method':
      if (isConditional(o.method.op)) return writeExpr(w, o.method, ctx);
      w.text('(');
      writeExpr(w, o.method, ctx);
      return w.text(')');
  }
};

const writeExpr = (w: PieceWriter, e: Expr, ctx: FormulaContext) => {
  if (isConditional(e.op)) {
    const [a, b, c, d] = e.values;
    w.text('IF(');
    writeOperand(w, a, ctx, false);
    w.text(` ${ASCII_OP[e.op]} `);
    writeOperand(w, b, ctx, false);
    w.text(', ');
    writeOperand(w, c, ctx, false);
    w.text(', ');
    writeOperand(w, d, ctx, false);
    return w.text(')');
  }
  e.values.forEach((v, i) => {
    if (i > 0) w.text(` ${ASCII_OP[e.op]} `);
    // a negative constant as the base of a power needs brackets: -2 ^ 2 reads as -(2 ^ 2)
    writeOperand(w, v, ctx, e.op === 'power' && i === 0);
  });
};

/** The formula for a method's expression; nested expressions get brackets, as in the visual editor. */
export const formatPieces = (e: Expr, ctx: FormulaContext): Piece[] => {
  const w = new PieceWriter();
  writeExpr(w, e, ctx);
  return w.pieces;
};

/** Plain text of a formula, e.g. for copying; references become their typed form. */
export const piecesToText = (pieces: Piece[], ctx: FormulaContext): string =>
  pieces
    .map((p) => {
      if (p.kind === 'text') return p.text;
      if (p.kind === 'slot') return '';
      const label = refLabel(p.ref, ctx);
      return label ? labelText(label) : '#REF';
    })
    .join('');

// ----------------------------------------------------------------------------------------------- parsing

type Token =
  | { t: 'num'; value: string }
  | { t: 'label'; symbol: string; subscript: string; text: string }
  | { t: 'ref'; ref: RefOperand }
  | { t: 'slot'; name: string }
  | { t: 'op'; value: '+' | '-' | '*' | '/' | '^' }
  | { t: 'cmp'; op: Op }
  | { t: 'if' }
  | { t: '(' }
  | { t: ')' }
  | { t: ',' }
  | { t: 'eof' };

type Located = Token & { piece: number; from: number; to: number };

class FormulaError extends Error {
  constructor(
    message: string,
    readonly at: { piece: number; from: number; to: number }
  ) {
    super(message);
  }
}

const OP_CHARS: Record<string, '+' | '-' | '*' | '/' | '^'> = {
  '+': '+',
  '-': '-',
  '−': '-',
  '*': '*',
  '×': '*',
  '/': '/',
  '÷': '/',
  '^': '^'
};

const tokenizeText = (text: string, piece: number, out: Located[]) => {
  let i = 0;
  const at = (from: number, to: number) => ({ piece, from, to });
  while (i < text.length) {
    const c = text[i];
    const rest = text.slice(i);
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    const num = NUMBER.exec(rest);
    if (num) {
      out.push({ t: 'num', value: num[0], ...at(i, i + num[0].length) });
      i += num[0].length;
      continue;
    }
    if (rest.startsWith('#REF')) throw new FormulaError('This reference no longer exists', at(i, i + 4));
    if (OP_CHARS[c]) {
      out.push({ t: 'op', value: OP_CHARS[c], ...at(i, i + 1) });
      i++;
      continue;
    }
    if (c === '<' || c === '>') {
      out.push({ t: 'cmp', op: c === '<' ? 'smallerThan' : 'greaterThan', ...at(i, i + 1) });
      i++;
      continue;
    }
    if (c === '=') {
      const len = rest.startsWith('==') ? 2 : 1;
      out.push({ t: 'cmp', op: 'equal', ...at(i, i + len) });
      i += len;
      continue;
    }
    if (c === '(' || c === ')' || c === ',') {
      out.push({ t: c, ...at(i, i + 1) });
      i++;
      continue;
    }
    // a symbol: one letter, a Greek name or a Greek letter, then an optional subscript
    const word = /^[A-Za-z]+/.exec(rest)?.[0];
    let symbol: string;
    const start = i;
    if (word && word.length > 1) {
      if (word.toUpperCase() === 'IF' && /^\s*\(/.test(text.slice(i + 2))) {
        out.push({ t: 'if', ...at(i, i + 2) });
        i += 2;
        continue;
      }
      if (!GREEK_NAMES[word]) {
        const hint = [...word].every((ch) => SYMBOL_CHARS.includes(ch)) ? `; use ${[...word].join(' * ')}` : '';
        throw new FormulaError(`Unknown name ${word}${hint}`, at(i, i + word.length));
      }
      symbol = GREEK_NAMES[word];
      i += word.length;
    } else if (SYMBOL_CHARS.includes(c)) {
      symbol = c;
      i++;
    } else throw new FormulaError(`Unexpected ${c}`, at(i, i + 1));
    let subscript = '';
    if (text[i] === '_') {
      if (text[i + 1] === '{') {
        let depth = 0;
        let j = i + 1;
        for (; j < text.length; j++) {
          if (text[j] === '{') depth++;
          if (text[j] === '}' && --depth === 0) break;
        }
        if (j >= text.length) throw new FormulaError('Missing } after the subscript', at(i, text.length));
        subscript = text.slice(i + 2, j);
        i = j + 1;
      } else {
        subscript = /^[a-z0-9]*/.exec(text.slice(i + 1))![0];
        if (!subscript) throw new FormulaError('Expected a subscript after _', at(i, i + 1));
        i += 1 + subscript.length;
      }
    }
    out.push({ t: 'label', symbol, subscript, text: text.slice(start, i), ...at(start, i) });
  }
};

const tokenize = (pieces: Piece[]): Located[] => {
  const out: Located[] = [];
  pieces.forEach((p, n) => {
    if (p.kind === 'text') tokenizeText(p.text, n, out);
    else if (p.kind === 'ref') out.push({ t: 'ref', ref: p.ref, piece: n, from: 0, to: 0 });
    else out.push({ t: 'slot', name: p.name, piece: n, from: 0, to: 0 });
  });
  const last = pieces.length - 1;
  const end = pieces[last]?.kind === 'text' ? (pieces[last] as { text: string }).text.length : 0;
  out.push({ t: 'eof', piece: Math.max(0, last), from: end, to: end });
  return out;
};

const sameLabel = (a: Pick<Label, 'symbol' | 'subscript'>) => (b: Label) => a.symbol === b.symbol && a.subscript === b.subscript;

const describe = (tok: Located) => {
  switch (tok.t) {
    case 'eof':
      return 'the end';
    case 'num':
      return tok.value;
    case 'label':
      return tok.text;
    case 'op':
      return tok.value;
    case 'cmp':
      return ASCII_OP[tok.op];
    case 'if':
      return 'IF';
    case 'ref':
    case 'slot':
      return 'a term';
    default:
      return tok.t;
  }
};

class Parser {
  private i = 0;
  constructor(
    private readonly tokens: Located[],
    private readonly ctx: FormulaContext
  ) {}

  private peek = () => this.tokens[this.i];
  private next = () => this.tokens[this.i++];
  private fail(message: string, tok = this.peek()): never {
    throw new FormulaError(message, tok);
  }
  private expect<T extends Located['t']>(t: T, what: string) {
    const tok = this.peek();
    if (tok.t !== t) this.fail(`Expected ${what} instead of ${describe(tok)}`);
    return this.next();
  }

  formula(): Expr {
    const first = this.peek();
    if (first.t === 'cmp' && first.op === 'equal') this.next();
    if (this.peek().t === 'eof') this.fail('Type a formula, e.g. l * w');
    const result = this.sum();
    const tok = this.peek();
    if (tok.t === 'cmp') this.fail('Comparisons only work inside IF(a < b, then, else)');
    if (tok.t !== 'eof') this.fail(`Unexpected ${describe(tok)}`);
    if (result.type !== 'method') this.fail('A method needs an operation, e.g. l * 2', first);
    return result.method;
  }

  /** a left-associative chain where runs of the n-ary operator merge into one node */
  private chain(operand: () => Operand, ops: Partial<Record<string, Op>>, nary: Op): Operand {
    let op: Op | null = null;
    let values = [operand()];
    const close = (): Operand => (op ? { type: 'method', method: { op, values } } : values[0]);
    for (;;) {
      const tok = this.peek();
      const next = tok.t === 'op' ? ops[tok.value] : undefined;
      if (!next) return close();
      this.next();
      const rhs = operand();
      if (next === nary && op === nary) {
        if (values.length >= OP_ARITY[nary].max)
          this.fail(`${OP_LABEL[nary]} takes at most ${OP_ARITY[nary].max} terms; group some in brackets`, tok);
        values.push(rhs);
      } else {
        values = [close(), rhs];
        op = next;
      }
    }
  }

  private sum = (): Operand => this.chain(this.product, { '+': 'addition', '-': 'subtraction' }, 'addition');
  private product = (): Operand => this.chain(this.unary, { '*': 'multiplication', '/': 'division' }, 'multiplication');

  private unary = (): Operand => {
    const tok = this.peek();
    if (tok.t !== 'op' || tok.value !== '-') return this.power();
    this.next();
    const v = this.unary();
    if (v.type === 'hardcoded') return { type: 'hardcoded', value: v.value.startsWith('-') ? v.value.slice(1) : `-${v.value}` };
    return { type: 'method', method: { op: 'multiplication', values: [{ type: 'hardcoded', value: '-1' }, v] } };
  };

  private power = (): Operand => {
    const base = this.atom();
    const tok = this.peek();
    if (tok.t !== 'op' || tok.value !== '^') return base;
    this.next();
    return { type: 'method', method: { op: 'power', values: [base, this.unary()] } };
  };

  private atom = (): Operand => {
    const tok = this.next();
    switch (tok.t) {
      case 'num': {
        if (tok.value.length > 31 || [...tok.value].some((c) => !NUMBER_CHARS.includes(c)) || !Number.isFinite(parseConstant(tok.value)))
          this.fail(`${tok.value} is not a number that can be stored`, tok);
        return { type: 'hardcoded', value: tok.value };
      }
      case 'ref':
        if (!refLabel(tok.ref, this.ctx)) this.fail('This reference no longer exists', tok);
        return { ...tok.ref };
      case 'label':
        return this.resolve(tok);
      case 'slot':
        return this.fail(`Fill in ‹${tok.name}›`, tok);
      case '(': {
        const inner = this.sum();
        if (this.peek().t === 'cmp') this.fail('Comparisons only work inside IF(a < b, then, else)');
        this.expect(')', ')');
        return inner;
      }
      case 'if':
        return this.conditional();
      case 'eof':
        return this.fail('The formula ends too early', tok);
      default:
        return this.fail(`Unexpected ${describe(tok)}`, tok);
    }
  };

  private conditional(): Operand {
    this.expect('(', '(');
    const a = this.sum();
    const cmp = this.peek();
    if (cmp.t !== 'cmp') this.fail('IF needs a comparison first, e.g. IF(l < w, l, w)');
    this.next();
    const b = this.sum();
    this.expect(',', ', and the value if true');
    const c = this.sum();
    this.expect(',', ', and the value if false');
    const d = this.sum();
    this.expect(')', ')');
    return { type: 'method', method: { op: cmp.op, values: [a, b, c, d] } };
  }

  private resolve(tok: Extract<Located, { t: 'label' }>): Operand {
    const match = sameLabel(tok);
    const inputs = this.ctx.inputs.flatMap((l, index) => (match(l) ? [index] : []));
    const methods = this.ctx.methods.flatMap((l, index) => (match(l) ? [index] : []));
    if (inputs.length + methods.length > 1)
      this.fail(`${tok.text} is used by more than one definition; pick it from the suggestions or rename one`, tok);
    if (inputs.length) return { type: 'numericInput', index: inputs[0] };
    if (methods.length) return { type: 'methodOutput', index: methods[0] };
    const later = this.ctx.later?.findIndex(match) ?? -1;
    if (later === 0) this.fail(`A method can't use its own result`, tok);
    if (later > 0) this.fail(`${tok.text} comes after this method; only earlier results can be used`, tok);
    return this.fail(`Unknown name ${tok.text}`, tok);
  }
}

/** Parses a formula into an expression, or reports the first problem and where it is. */
export const parsePieces = (pieces: Piece[], ctx: FormulaContext): ParseResult => {
  try {
    return { ok: true, expr: new Parser(tokenize(pieces), ctx).formula() };
  } catch (e) {
    if (e instanceof FormulaError) return { ok: false, message: e.message, ...e.at };
    throw e;
  }
};

export const parseFormula = (text: string, ctx: FormulaContext) => parsePieces([{ kind: 'text', text }], ctx);
