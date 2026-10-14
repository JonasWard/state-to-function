// The editor's DOM is the source of truth while typing: text nodes plus non-editable token spans.
import symbolStyles from '../../Components/math/MathSymbol.module.css';
import { symbolLabel } from '../../Components/math/symbolLabel';
import { FormulaContext, Piece, RefOperand, refLabel } from '../../model/formula';
import styles from './formula.module.css';

// keeps a caret position next to a token at the start or end, or between two tokens
const ZWSP = '\u200B';

export const makeToken = (ref: RefOperand, ctx: FormulaContext): HTMLElement => {
  const label = refLabel(ref, ctx)!;
  const el = document.createElement('span');
  el.contentEditable = 'false';
  el.dataset.ref = `${ref.type}:${ref.index}`;
  el.className = styles.token;
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', `${symbolLabel(label.symbol, label.subscript)}, change reference`);
  const symbol = document.createElement('var');
  symbol.className = `${symbolStyles.symbol} ${symbolStyles.sm}`;
  symbol.textContent = label.symbol;
  if (label.subscript) symbol.append(Object.assign(document.createElement('sub'), { textContent: label.subscript }));
  const caret = Object.assign(document.createElement('span'), { className: styles.caret, textContent: '▾' });
  caret.setAttribute('aria-hidden', 'true');
  el.append(symbol, caret);
  return el;
};

export const makeSlot = (name: string): HTMLElement => {
  const el = document.createElement('span');
  el.contentEditable = 'false';
  el.dataset.slot = name;
  el.className = styles.slot;
  el.textContent = name;
  return el;
};

const isAtom = (n: Node | undefined) => n instanceof HTMLElement && (n.dataset.ref || n.dataset.slot);

export const renderPieces = (root: HTMLElement, pieces: Piece[], ctx: FormulaContext) => {
  const nodes: Node[] = pieces.map((p) =>
    p.kind === 'text' ? document.createTextNode(p.text) : p.kind === 'ref' ? makeToken(p.ref, ctx) : makeSlot(p.name)
  );
  const padded: Node[] = [];
  nodes.forEach((n, i) => {
    if (isAtom(n) && (i === 0 || isAtom(nodes[i - 1]))) padded.push(document.createTextNode(ZWSP));
    padded.push(n);
  });
  if (isAtom(padded[padded.length - 1])) padded.push(document.createTextNode(ZWSP));
  root.replaceChildren(...padded);
};

export const readPieces = (root: HTMLElement): Piece[] => {
  const out: Piece[] = [];
  const text = (t: string) => {
    const last = out[out.length - 1];
    if (last?.kind === 'text') last.text += t;
    else out.push({ kind: 'text', text: t });
  };
  const walk = (n: Node) => {
    if (n.nodeType === Node.TEXT_NODE) return text((n.textContent ?? '').replace(/\u200B/g, '').replace(/\u00A0/g, ' '));
    if (!(n instanceof HTMLElement)) return;
    if (n.dataset.ref) {
      const [type, index] = n.dataset.ref.split(':');
      return out.push({ kind: 'ref', ref: { type: type as RefOperand['type'], index: Number(index) } });
    }
    if (n.dataset.slot) return out.push({ kind: 'slot', name: n.dataset.slot });
    n.childNodes.forEach(walk);
  };
  root.childNodes.forEach(walk);
  return out.filter((p) => p.kind !== 'text' || p.text);
};

/** Inserts a token or text in place of a range, and puts the caret after it. */
export const insertAt = (range: Range, node: Node) => {
  range.deleteContents();
  range.insertNode(node);
  // a token needs text after it, or the caret has nowhere to go
  let caretAfter: Node = node;
  if (isAtom(node) && node.nextSibling?.nodeType !== Node.TEXT_NODE) {
    caretAfter = document.createTextNode(ZWSP);
    node.parentNode!.insertBefore(caretAfter, node.nextSibling);
  }
  placeCaret({ after: caretAfter });
};

/** Selects a placeholder, so typing or a suggestion replaces it. */
export const selectSlot = (slot: HTMLElement) => {
  slot.closest('[contenteditable="true"]')?.querySelector('[data-selected]')?.removeAttribute('data-selected');
  slot.setAttribute('data-selected', '');
  const range = document.createRange();
  range.selectNode(slot);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
};

/** Replaces a range with `IF(‹test›, ‹if true›, ‹if false›)` and selects the first placeholder. */
export const insertIf = (range: Range) => {
  range.deleteContents();
  const nodes = [
    document.createTextNode('IF('),
    makeSlot('test'),
    document.createTextNode(', '),
    makeSlot('if true'),
    document.createTextNode(', '),
    makeSlot('if false'),
    document.createTextNode(')')
  ];
  [...nodes].reverse().forEach((n) => range.insertNode(n));
  selectSlot(nodes[1] as HTMLElement);
};

/** The next placeholder after the caret, wrapping around to the first. */
export const nextSlot = (root: HTMLElement): HTMLElement | null => {
  const slots = [...root.querySelectorAll<HTMLElement>('[data-slot]')];
  const sel = window.getSelection();
  if (!slots.length || !sel?.rangeCount) return slots[0] ?? null;
  const caret = sel.getRangeAt(0);
  return slots.find((s) => !s.hasAttribute('data-selected') && caret.comparePoint(s, 0) > 0) ?? slots[0];
};

export const placeCaret = (where: { after: Node } | { endOf: Node }) => {
  const range = document.createRange();
  if ('after' in where) range.setStartAfter(where.after);
  else {
    range.selectNodeContents(where.endOf);
    range.collapse(false);
  }
  range.collapse(true);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
};

/** The token directly before a collapsed caret, if any (skipping the zero-width padding). */
export const tokenBeforeCaret = (root: HTMLElement): HTMLElement | null => {
  const sel = window.getSelection();
  if (!sel?.isCollapsed || !sel.anchorNode || !root.contains(sel.anchorNode)) return null;
  let node: Node | null = sel.anchorNode;
  let offset = sel.anchorOffset;
  if (node.nodeType === Node.TEXT_NODE) {
    if ((node.textContent ?? '').slice(0, offset).replace(/\u200B/g, '')) return null;
    offset = [...node.parentNode!.childNodes].indexOf(node as ChildNode);
    node = node.parentNode;
  }
  let before = node?.childNodes[offset - 1];
  while (before?.nodeType === Node.TEXT_NODE && !before.textContent?.replace(/\u200B/g, '')) before = before.previousSibling ?? undefined;
  return before instanceof HTMLElement && before.dataset.ref ? before : null;
};
