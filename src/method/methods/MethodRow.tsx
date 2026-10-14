import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import React from 'react';
import { CharsetInput } from '../../Components/inputs/CharsetInput';
import { SymbolPicker } from '../../Components/inputs/SymbolPicker';
import { symbolLabel } from '../../Components/math/symbolLabel';
import { NAME_CHARS, SUBSCRIPT_CHARS } from '../../model/charsets';
import { formatNumber } from '../../model/numeric';
import { MethodDef } from '../../model/types';
import sectionStyles from '../../Components/layout/Section.module.css';
import styles from '../definitions.module.css';
import { ReferenceContext } from '../expression/context';
import { ExpressionView } from '../expression/ExpressionView';
import { Button } from '../../Components/ui/Button';

export const MethodRow: React.FC<{
  value: MethodDef;
  index: number;
  result: number;
  duplicate: boolean;
  references: number;
  compact: boolean;
  context: ReferenceContext;
  onChange: (value: MethodDef) => void;
  onRemove: () => void;
}> = ({ value, index, result, duplicate, references, compact, context, onChange, onRemove }) => {
  const label = `method ${symbolLabel(value.symbol, value.subscript)}`;
  const remove = (
    <Button variant="text" size="small" icon={<DeleteOutlined />} aria-label={`Remove ${label}`} onClick={references ? undefined : onRemove} />
  );
  return (
    <div className={`${styles.row} ${styles.methodGrid} ${compact ? styles.compact : ''}`}>
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
      <div className={styles.expr}>
        <ExpressionView value={value.method} context={context} onChange={(method) => onChange({ ...value, method })} />
      </div>
      <output className={styles.result} aria-label={`${label} result`}>
        <span className={sectionStyles.equals} aria-hidden>
          =
        </span>
        {formatNumber(result)}
      </output>
      <div className={styles.del}>
        {references ? (
          <Popconfirm
            title={`Remove ${label}?`}
            description={`It is used ${references}× — those places get its expression.`}
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
