import { FormulaContext, GREEK_NAMES, labelText, RefOperand } from '../../model/formula';
import { Label } from '../../model/types';

export type Suggestion = { kind: 'ref'; ref: RefOperand; label: Label } | { kind: 'if' };

const WORD = /(?:[A-Za-z\p{Script=Greek}?][A-Za-z0-9_{}]*)$/u;
const MAX = 8;

/**
 * What to offer for the word being typed just before the caret: references by how they are typed (`A_t`),
 * by Greek name (`alp` → α) or by their name (`are` → Area Top), and IF.
 */
export const suggest = (before: string, ctx: FormulaContext): { from: number; items: Suggestion[] } | null => {
  const word = WORD.exec(before)?.[0];
  if (!word) return null;
  const from = before.length - word.length;
  // the e of a number such as 2e3 is not a word
  if (/[0-9.]$/.test(before.slice(0, from))) return null;
  const lower = word.toLowerCase();
  const rank = (l: Label): number => {
    const typed = labelText(l);
    if (typed.startsWith(word)) return 0;
    if (typed.toLowerCase().startsWith(lower)) return 1;
    if (word.length > 1 && Object.entries(GREEK_NAMES).some(([name, ch]) => ch === l.symbol && name.startsWith(word))) return 2;
    if (word.length > 1 && l.name.toLowerCase().split(/\s+/).some((w) => w.startsWith(lower))) return 3;
    return -1;
  };
  const refs = [
    ...ctx.inputs.map((label, index) => ({ ref: { type: 'numericInput' as const, index }, label })),
    ...ctx.methods.map((label, index) => ({ ref: { type: 'methodOutput' as const, index }, label }))
  ]
    .map((r) => ({ ...r, rank: rank(r.label) }))
    .filter((r) => r.rank >= 0)
    .sort((a, b) => a.rank - b.rank)
    .map(({ ref, label }): Suggestion => ({ kind: 'ref', ref, label }));
  const items: Suggestion[] = [...refs.slice(0, MAX), ...('if'.startsWith(lower) ? [{ kind: 'if' as const }] : [])];
  return items.length ? { from, items } : null;
};
