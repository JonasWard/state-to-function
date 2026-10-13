import React from 'react';
import { MathSymbol } from '../Components/math/MathSymbol';
import { symbolLabel } from '../Components/math/symbolLabel';
import { formatNumber } from '../model/numeric';
import { MethodDef } from '../model/types';
import styles from './applet.module.css';

export const ResultsTable: React.FC<{ methods: MethodDef[]; results: number[]; showNames: boolean }> = ({
  methods,
  results,
  showNames
}) =>
  methods.length ? (
    <div role="list">
      {methods.map((m, i) => (
        <div key={i} role="listitem" className={`${styles.row} ${styles.resultRow}`}>
          <MathSymbol symbol={m.symbol} subscript={m.subscript} size="md" />
          <span className={styles.name}>{showNames && m.name}</span>
          <output className={styles.value} aria-label={`${symbolLabel(m.symbol, m.subscript)} result`}>
            {formatNumber(results[i])}
          </output>
        </div>
      ))}
    </div>
  ) : (
    <p className={styles.empty}>No methods defined yet.</p>
  );
