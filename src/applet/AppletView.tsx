import { Hash, SquareFunction, Undo2 } from 'lucide-react';
import { Tooltip } from '../Components/ui/Tooltip';
import React from 'react';
import { NumberField } from '../Components/inputs/NumberField';
import { SectionHeader } from '../Components/layout/Section';
import { MathSymbol } from '../Components/math/MathSymbol';
import { symbolLabel } from '../Components/math/symbolLabel';
import { AppletField, getAppletFields } from '../model/appletSchema';
import { formatNumber } from '../model/numeric';
import { InputDef } from '../model/types';
import { useDocumentStore, useEvaluation } from '../state/documentStore';
import { useUIStore } from '../state/uiStore';
import styles from './applet.module.css';
import { ExportButtons } from './ExportButtons';
import { ResultsTable } from './ResultsTable';
import { Button } from '../Components/ui/Button';

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
        <input
          type="range"
          className={styles.slider}
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          disabled={field.min === field.max}
          aria-label={`${label} slider`}
          onChange={(e) => setOverride(field.inputIndex, Number(e.target.value), `slider-${field.inputIndex}`)}
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
          variant="text"
          size="small"
          icon={<Undo2 />}
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
        <SectionHeader
          id="applet-inputs"
          icon={<Hash />}
          title="Inputs"
          aside={
            <Button size="small" variant="text" disabled={!overrides.some((o) => o !== null)} onClick={() => useDocumentStore.getState().resetApplet()}>
              Reset all
            </Button>
          }
        />
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
        <SectionHeader id="applet-results" icon={<SquareFunction />} title="Results" />
        <ResultsTable methods={definition.methods} results={results} showNames={showNames} />
        <div className={styles.exports}>
          <ExportButtons />
        </div>
      </section>
    </div>
  );
};
