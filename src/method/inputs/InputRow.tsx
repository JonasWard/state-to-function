import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, Segmented } from 'antd';
import React from 'react';
import { CharsetInput } from '../../Components/inputs/CharsetInput';
import { ConstantInput } from '../../Components/inputs/ConstantInput';
import { NumberField } from '../../Components/inputs/NumberField';
import { SymbolPicker } from '../../Components/inputs/SymbolPicker';
import mathStyles from '../../Components/math/MathSymbol.module.css';
import { symbolLabel } from '../../Components/math/symbolLabel';
import { NAME_CHARS, SUBSCRIPT_CHARS } from '../../model/charsets';
import { FLOAT_MAX, FLOAT_MIN, INT_MAX, INT_MIN } from '../../model/numeric';
import { changeKind } from '../../model/ops';
import { InputDef, InputKindType, NumericKind } from '../../model/types';
import styles from '../definitions.module.css';
import { Button } from '../../Components/ui/Button';

const KIND_OPTIONS = [
  { value: 'constant', label: <span className={mathStyles.glyph} aria-label="Constant">𝑐</span>, title: 'Constant' },
  { value: 'integer', label: <span className={mathStyles.glyph} aria-label="Integer">ℤ</span>, title: 'Integer' },
  { value: 'float', label: <span className={mathStyles.glyph} aria-label="Decimal">ℝ</span>, title: 'Decimal' }
];

const NumericFields: React.FC<{ kind: NumericKind; label: string; onChange: (k: NumericKind) => void }> = ({
  kind,
  label,
  onChange
}) => {
  const bounds =
    kind.type === 'integer'
      ? { min: INT_MIN, max: INT_MAX, precision: 0 }
      : { min: FLOAT_MIN, max: FLOAT_MAX };
  const inverted = kind.min > kind.max;
  const outside = !inverted && (kind.value < kind.min || kind.value > kind.max);
  return (
    <>
      {(['min', 'value', 'max'] as const).map((field) => (
        <div key={field} className={field === 'value' ? styles.val : styles[field]}>
          <NumberField
            {...bounds}
            value={kind[field]}
            ariaLabel={`${label} ${field === 'value' ? 'default' : field}`}
            status={(field !== 'value' && inverted) || (field === 'value' && outside) ? 'warning' : undefined}
            onCommit={(v) => onChange({ ...kind, [field]: v })}
          />
        </div>
      ))}
    </>
  );
};

export const InputRow: React.FC<{
  value: InputDef;
  index: number;
  duplicate: boolean;
  references: number;
  canRemove: boolean;
  compact: boolean;
  onChange: (value: InputDef) => void;
  onRemove: () => void;
}> = ({ value, index, duplicate, references, canRemove, compact, onChange, onRemove }) => {
  const label = `input ${symbolLabel(value.symbol, value.subscript)}`;
  const remove = (
    <Button variant="text" size="small" icon={<DeleteOutlined />} aria-label={`Remove ${label}`} disabled={!canRemove} onClick={references ? undefined : onRemove} />
  );
  return (
    <div className={`${styles.row} ${styles.inputGrid} ${compact ? styles.compact : ''}`}>
      <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
      <div className={styles.sym}>
        <SymbolPicker symbol={value.symbol} subscript={value.subscript} duplicate={duplicate} onChange={(symbol) => onChange({ ...value, symbol })} />
      </div>
      <div className={styles.sub}>
        <CharsetInput value={value.subscript} charset={SUBSCRIPT_CHARS} placeholder="sub" ariaLabel={`${label} subscript`} onCommit={(subscript) => onChange({ ...value, subscript })} />
      </div>
      <div className={styles.name}>
        <CharsetInput value={value.name} charset={NAME_CHARS} placeholder="name" ariaLabel={`${label} name`} onCommit={(name) => onChange({ ...value, name })} />
      </div>
      <div className={styles.type}>
        <Segmented
          size="small"
          value={value.kind.type}
          options={KIND_OPTIONS}
          onChange={(t) => onChange({ ...value, kind: changeKind(value.kind, t as InputKindType) })}
        />
      </div>
      {value.kind.type === 'constant' ? (
        <div className={styles.constant}>
          <ConstantInput value={value.kind.value} ariaLabel={`${label} value`} onCommit={(v) => onChange({ ...value, kind: { type: 'constant', value: v } })} />
        </div>
      ) : (
        <NumericFields kind={value.kind} label={label} onChange={(kind) => onChange({ ...value, kind })} />
      )}
      <div className={styles.del}>
        {references && canRemove ? (
          <Popconfirm
            title={`Remove ${label}?`}
            description={`It is used ${references}× — those places get its default value.`}
            okText="Remove"
            onConfirm={onRemove}
          >
            {remove}
          </Popconfirm>
        ) : (
          remove
        )}
      </div>
    </div>
  );
};
