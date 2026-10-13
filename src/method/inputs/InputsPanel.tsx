import { NumberOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { MAX_INPUTS } from '../../model/numeric';
import { addInput, countReferences, isDuplicateLabel, removeInput, setInput } from '../../model/ops';
import { useDocumentStore } from '../../state/documentStore';
import { useUIStore } from '../../state/uiStore';
import styles from '../definitions.module.css';
import { InputRow } from './InputRow';

const doc = () => useDocumentStore.getState();

export const InputsPanel: React.FC = () => {
  const definition = useDocumentStore((s) => s.definition);
  const compact = useUIStore((s) => s.settings.compactRows);
  return (
    <section className={styles.panel} aria-labelledby="inputs-title">
      <header className={styles.panelHeader}>
        <h2 id="inputs-title" className={styles.panelTitle}>
          <NumberOutlined /> Inputs
        </h2>
        <span className={styles.count}>
          {definition.inputs.length}/{MAX_INPUTS}
        </span>
      </header>
      <div className={`${styles.columns} ${styles.inputGrid} ${compact ? styles.compact : ''}`} aria-hidden>
        <span className={styles.index}>#</span>
        <span className={styles.sym}>Sym</span>
        <span className={styles.sub}>Sub</span>
        <span className={styles.name}>Name</span>
        <span className={styles.type}>Type</span>
        <span className={styles.min}>Min</span>
        <span className={styles.val}>Default</span>
        <span className={styles.max}>Max</span>
      </div>
      {definition.inputs.map((input, i) => (
        <InputRow
          key={i}
          value={input}
          index={i}
          compact={compact}
          duplicate={isDuplicateLabel(definition, input)}
          references={countReferences(definition, 'numericInput', i)}
          canRemove={definition.inputs.length > 1}
          onChange={(next) => doc().commit({ definition: setInput(doc().definition, i, next) })}
          onRemove={() =>
            doc().commit({
              definition: removeInput(doc().definition, i),
              overrides: doc().overrides.filter((_, j) => j !== i)
            })
          }
        />
      ))}
      <Button
        className={styles.add}
        type="dashed"
        block
        icon={<PlusOutlined />}
        disabled={definition.inputs.length >= MAX_INPUTS}
        onClick={() => doc().commit({ definition: addInput(doc().definition) })}
      >
        Add input
      </Button>
    </section>
  );
};
