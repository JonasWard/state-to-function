import { RollbackOutlined } from '@ant-design/icons';
import { Button, Slider, Tooltip } from 'antd';
import React from 'react';
import { NumberField } from '../Components/inputs/NumberField';
import { MathSymbol } from '../Components/math/MathSymbol';
import { symbolLabel } from '../Components/math/symbolLabel';
import { AppletField, getAppletFields } from '../model/appletSchema';
import { formatNumber } from '../model/numeric';
import { InputDef } from '../model/types';
import { useDocumentStore, useEvaluation } from '../state/documentStore';
import { useUIStore } from '../state/uiStore';
import styles from './applet.module.css';
import { ResultsTable } from './ResultsTable';

const setOverride = (i: number, v: number | null, coalesceKey?: string) =>
  useDocumentStore.getState().setOverride(i, v, { coalesceKey });

const InputControl: React.FC<{ field: AppletField; input: InputDef; value: number; overridden: boolean }> = ({
  field,
  input,
  value,
  overridden
}) => {
  const { showNamesInApplet, showRangeHints } = useUIStore((s) => s.settings);
  const label = symbolLabel(input.symbol, input.subscript);
  return (
    <div className={styles.row}>
      <MathSymbol symbol={input.symbol} subscript={input.subscript} size="md" />
      <div className={styles.control}>
        <Slider
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          disabled={field.min === field.max}
          tooltip={{ formatter: (v) => formatNumber(v ?? 0) }}
          aria-label={`${label} slider`}
          onChange={(v) => setOverride(field.inputIndex, v, `slider-${field.inputIndex}`)}
        />
        <NumberField
          value={value}
          min={field.min}
          max={field.max}
          precision={field.type === 'integer' ? 0 : undefined}
          ariaLabel={label}
          onCommit={(v) => setOverride(field.inputIndex, v)}
        />
      </div>
      <Tooltip title="Reset to default">
        <Button
          type="text"
          size="small"
          icon={<RollbackOutlined />}
          aria-label={`Reset ${label} to default`}
          disabled={!overridden}
          onClick={() => setOverride(field.inputIndex, null)}
        />
      </Tooltip>
      {(showNamesInApplet || showRangeHints) && (
        <div className={styles.meta}>
          <span className={styles.name}>{showNamesInApplet && input.name}</span>
          {showRangeHints && (
            <span className={styles.range}>
              {formatNumber(field.min)} … {formatNumber(field.max)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const AppletView: React.FC = () => {
  const definition = useDocumentStore((s) => s.definition);
  const overrides = useDocumentStore((s) => s.overrides);
  const showNames = useUIStore((s) => s.settings.showNamesInApplet);
  const { values, results } = useEvaluation();
  const fields = getAppletFields(definition);
  return (
    <div className={styles.view}>
      <section className={styles.section} aria-labelledby="applet-inputs">
        <header className={styles.sectionHeader}>
          <h2 id="applet-inputs" className={styles.sectionTitle}>
            Inputs
          </h2>
          <Button size="small" type="text" disabled={!overrides.some((o) => o !== null)} onClick={() => useDocumentStore.getState().resetApplet()}>
            Reset all
          </Button>
        </header>
        {fields.length ? (
          fields.map((f) => (
            <InputControl
              key={f.inputIndex}
              field={f}
              input={definition.inputs[f.inputIndex]}
              value={values[f.inputIndex]}
              overridden={overrides[f.inputIndex] !== null}
            />
          ))
        ) : (
          <p className={styles.empty}>All inputs are constants; there is nothing to adjust.</p>
        )}
      </section>
      <section className={styles.section} aria-labelledby="applet-results">
        <header className={styles.sectionHeader}>
          <h2 id="applet-results" className={styles.sectionTitle}>
            Results
          </h2>
        </header>
        <ResultsTable methods={definition.methods} results={results} showNames={showNames} />
      </section>
    </div>
  );
};
