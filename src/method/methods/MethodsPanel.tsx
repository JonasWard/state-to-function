import { FunctionOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { MAX_METHODS } from '../../model/numeric';
import { addMethod, countReferences, isDuplicateLabel, removeMethod, setMethod } from '../../model/ops';
import { useDocumentStore, useEvaluation } from '../../state/documentStore';
import { useUIStore } from '../../state/uiStore';
import styles from '../definitions.module.css';
import { MethodRow } from './MethodRow';

const doc = () => useDocumentStore.getState();

export const MethodsPanel: React.FC = () => {
  const definition = useDocumentStore((s) => s.definition);
  const compact = useUIStore((s) => s.settings.compactRows);
  const { results } = useEvaluation();
  return (
    <section className={styles.panel} aria-labelledby="methods-title">
      <header className={styles.panelHeader}>
        <h2 id="methods-title" className={styles.panelTitle}>
          <FunctionOutlined /> Methods
        </h2>
        <span className={styles.count}>
          {definition.methods.length}/{MAX_METHODS}
        </span>
      </header>
      {definition.methods.map((method, i) => (
        <MethodRow
          key={i}
          value={method}
          index={i}
          result={results[i]}
          compact={compact}
          duplicate={isDuplicateLabel(definition, method)}
          references={countReferences(definition, 'methodOutput', i)}
          context={{ inputs: definition.inputs, methods: definition.methods.slice(0, i) }}
          onChange={(next) => doc().commit({ definition: setMethod(doc().definition, i, next) })}
          onRemove={() => doc().commit({ definition: removeMethod(doc().definition, i) })}
        />
      ))}
      <Button
        className={styles.add}
        type="dashed"
        block
        icon={<PlusOutlined />}
        disabled={definition.methods.length >= MAX_METHODS}
        onClick={() => doc().commit({ definition: addMethod(doc().definition) })}
      >
        Add method
      </Button>
    </section>
  );
};
