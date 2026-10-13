import { FormOutlined, FunctionOutlined, LinkOutlined, NumberOutlined, SignatureOutlined } from '@ant-design/icons';
import React from 'react';
import { OP_LABEL, OP_SYMBOL, OPS } from '../model/operators';
import styles from './Help.module.css';
import { SectionHeader } from './layout/Section';

const Row: React.FC<{ glyph: React.ReactNode; children: React.ReactNode }> = ({ glyph, children }) => (
  <>
    <span className={styles.glyph}>{glyph}</span>
    <span>{children}</span>
  </>
);

export const Help: React.FC = () => (
  <article className={styles.help}>
    <h1>State-to-Function</h1>
    <p className={styles.lead}>
      Build spreadsheet-like formulas, use them as a small calculator and keep everything in the link. No backend, no
      database, no tracking, no cookies. Bookmark or share the URL to come back to it.
    </p>

    <SectionHeader icon={<FormOutlined />} title="Definitions" />
    <p>
      The <b>Definitions</b> page has two parts: <b>Inputs</b> and <b>Methods</b>. On small screens they are separate
      tabs in the header. Every input and method has a symbol, plus an optional subscript and name. Click the symbol to
      pick another one; an outlined symbol means the same symbol and subscript are used more than once.
    </p>

    <h3>
      <NumberOutlined /> Inputs
    </h3>
    <div className={styles.table}>
      <Row glyph="𝑐">
        <b>Constant</b>: a fixed value you reuse, such as π or e.
      </Row>
      <Row glyph="ℤ">
        <b>Integer</b>: a whole number between a minimum and maximum, with a default.
      </Row>
      <Row glyph="ℝ">
        <b>Decimal</b>: like an integer, with two decimals of precision.
      </Row>
    </div>
    <p>Switching type keeps the value. Removing an input that is in use replaces it with its default value.</p>

    <h3>
      <FunctionOutlined /> Methods
    </h3>
    <p>
      A method is an operation on terms. A term is an input, the result of an <i>earlier</i> method, a constant or a
      nested expression in parentheses. Click any term or operator to change it. Each method shows its current result on
      the right.
    </p>
    <div className={styles.table}>
      {OPS.map((op) => (
        <Row key={op} glyph={OP_SYMBOL[op]}>
          {OP_LABEL[op]}
          {op === 'addition' || op === 'multiplication'
            ? ' — 2 to 8 terms; use + and − after the last term to add or remove one.'
            : op === 'smallerThan' || op === 'greaterThan' || op === 'equal'
              ? ' — compares the first two terms, then gives the third if true and the fourth if false.'
              : ' — two terms.'}
        </Row>
      ))}
    </div>

    <SectionHeader icon={<SignatureOutlined />} title="Applet" />
    <p>
      The applet lists the integer and decimal inputs with a slider and a field, limited to their ranges, and every
      method's result. Results that cannot be calculated show as <code>NaN</code>, division by zero as <code>∞</code>.
      Export the current values as CSV, or as a PDF that includes a QR code of the link.
    </p>

    <SectionHeader icon={<LinkOutlined />} title="Links and undo" />
    <p>
      The address holds the definitions and the applet values, so copying it (or using the link button) shares exactly
      what you see. Undo and redo cover both pages: <kbd>Ctrl</kbd> + <kbd>Z</kbd> and <kbd>Ctrl</kbd> + <kbd>Y</kbd>{' '}
      (or <kbd>⌘</kbd> on a Mac) when no text field is focused. The browser's back button moves between pages.
    </p>
    <p>
      Links made with earlier versions of the app are upgraded automatically when you open them; the address is then
      replaced with the new, shorter form.
    </p>
  </article>
);
