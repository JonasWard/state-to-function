import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useRole
} from '@floating-ui/react';
import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import { OptionGrid } from '../../Components/inputs/OptionGrid';
import overlay from '../../Components/ui/overlay.module.css';
import { formatPieces, parsePieces, RefOperand } from '../../model/formula';
import { Expr } from '../../model/types';
import { ReferenceContext } from '../expression/context';
import { symbolOptions } from '../expression/symbolOptions';
import { makeToken, placeCaret, readPieces, renderPieces, tokenBeforeCaret } from './dom';
import styles from './formula.module.css';

const readRef = (el: HTMLElement): RefOperand => {
  const [type, index] = el.dataset.ref!.split(':');
  return { type: type as RefOperand['type'], index: Number(index) };
};

/**
 * A method typed as a formula, e.g. `(A_t + A_f) * 2`. References are tokens with a dropdown to swap them.
 * Enter or leaving the field applies a valid formula; Escape goes back to the applied one.
 */
export const FormulaEditor: React.FC<{
  value: Expr;
  context: ReferenceContext;
  ariaLabel: string;
  onCommit: (value: Expr) => void;
}> = ({ value, context, ariaLabel, onCommit }) => {
  const root = useRef<HTMLDivElement>(null);
  const shown = useRef('');
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<HTMLElement | null>(null);
  const messageId = useId();

  // only what is shown: the expression and the labels of what it can reference
  const labels = [...context.inputs, ...context.methods].map((l) => [l.symbol, l.subscript]);
  const key = (expr: Expr) => JSON.stringify([expr, labels]);
  const reset = () => {
    renderPieces(root.current!, formatPieces(value, context), context);
    shown.current = key(value);
    setError(null);
  };
  // show the applied formula on mount and whenever it or a label changes elsewhere (undo, a link, a rename)
  useLayoutEffect(() => {
    if (shown.current !== key(value)) reset();
  });

  const parse = () => parsePieces(readPieces(root.current!), context);
  const check = () => {
    const r = parse();
    setError(r.ok ? null : r.message);
    return r;
  };
  const commit = () => {
    const r = check();
    if (!r.ok) return false;
    if (JSON.stringify(r.expr) !== JSON.stringify(value)) onCommit(r.expr);
    // typed references become tokens and spacing is normalised
    renderPieces(root.current!, formatPieces(r.expr, context), context);
    shown.current = key(r.expr);
    return true;
  };

  const { refs, floatingStyles, context: floating } = useFloating({
    open: !!token,
    // Escape returns to the editor; a click elsewhere leaves it, which applies the formula like a blur
    onOpenChange: (open, _event, reason) => {
      if (open) return;
      if (reason !== 'outside-press') return closeToken();
      dropToken();
      commit();
    },
    elements: { reference: token },
    placement: 'bottom-start',
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  });
  const { getFloatingProps } = useInteractions([useDismiss(floating), useRole(floating, { role: 'dialog' })]);

  const openToken = (el: HTMLElement) => {
    token?.removeAttribute('data-open');
    el.setAttribute('data-open', '');
    setToken(el);
  };
  const dropToken = () => {
    token?.removeAttribute('data-open');
    setToken(null);
  };
  const closeToken = (focusAfter: Node | null = token) => {
    dropToken();
    root.current?.focus();
    if (focusAfter?.isConnected) placeCaret({ after: focusAfter });
  };
  const swap = (ref: RefOperand) => {
    if (!token) return;
    const next = makeToken(ref, context);
    token.replaceWith(next);
    closeToken(next);
    check();
  };

  const current = token ? readRef(token) : null;
  return (
    <div className={styles.wrap}>
      <div
        ref={root}
        className={`${styles.editor} ${error ? styles.invalid : ''}`}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label={ariaLabel}
        aria-invalid={!!error}
        aria-describedby={error ? messageId : undefined}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        onInput={check}
        onClick={(e) => {
          const el = (e.target as Element).closest<HTMLElement>('[data-ref]');
          if (el) openToken(el);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (commit()) placeCaret({ endOf: root.current! });
          } else if (e.key === 'Escape') {
            e.preventDefault();
            reset();
          } else if (e.key === 'Backspace' && tokenBeforeCaret(root.current!)) {
            // remove a token in one go, with the padding that keeps the caret beside it
            e.preventDefault();
            const el = tokenBeforeCaret(root.current!)!;
            const pad = el.nextSibling;
            if (pad?.nodeType === Node.TEXT_NODE && !pad.textContent?.replace(/\u200B/g, '')) pad.remove();
            const before = el.previousSibling;
            el.remove();
            if (before) placeCaret({ after: before });
            check();
          } else if (e.key === 'ArrowDown' && e.altKey) {
            const el = tokenBeforeCaret(root.current!);
            if (el) {
              e.preventDefault();
              openToken(el);
            }
          } else if ((e.metaKey || e.ctrlKey) && ['b', 'i', 'u'].includes(e.key.toLowerCase())) e.preventDefault();
        }}
        onPaste={(e) => {
          e.preventDefault();
          document.execCommand('insertText', false, e.clipboardData.getData('text/plain').replace(/\s+/g, ' '));
        }}
        onBlur={() => {
          // focus moving into a token's dropdown is still editing
          if (!token) commit();
        }}
      />
      {error && (
        <p id={messageId} className={styles.message}>
          {error}
        </p>
      )}
      {token && current && (
        <FloatingPortal>
          <FloatingFocusManager context={floating} modal={false} returnFocus={false}>
            <div
              ref={refs.setFloating}
              className={`${overlay.popover} ${styles.picker}`}
              style={floatingStyles}
              aria-label="Reference"
              {...getFloatingProps()}
            >
              <OptionGrid
                title="Input"
                options={symbolOptions(context.inputs)}
                selectedKey={current.type === 'numericInput' ? current.index : undefined}
                onSelect={(index) => swap({ type: 'numericInput', index })}
              />
              <OptionGrid
                title="Result of an earlier method"
                empty="No earlier methods"
                options={symbolOptions(context.methods)}
                selectedKey={current.type === 'methodOutput' ? current.index : undefined}
                onSelect={(index) => swap({ type: 'methodOutput', index })}
              />
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
};
