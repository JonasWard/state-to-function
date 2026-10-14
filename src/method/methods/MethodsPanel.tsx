import { Plus, SquareFunction } from 'lucide-react';

import React from 'react';
import { SectionHeader } from '../../Components/layout/Section';
import { MAX_METHODS } from '../../model/numeric';
import { addMethod, countReferences, isDuplicateLabel, removeMethod, setMethod } from '../../model/ops';
import { useDocumentStore, useEvaluation } from '../../state/documentStore';
import { useUIStore } from '../../state/uiStore';
import styles from '../definitions.module.css';
import { MethodRow } from './MethodRow';
import { Button } from '../../Components/ui/Button';

const doc = () => useDocumentStore.getState();

export const MethodsPanel: React.FC = () => {
  const definition = useDocumentStore((s) => s.definition);
  const compact = useUIStore((s) => s.settings.compactRows);
  const { results } = useEvaluation();
  return (
    <section className={styles.panel} aria-labelledby="methods-title">
      <SectionHeader id="methods-title" icon={<SquareFunction />} title="Methods" aside={`${definition.methods.length}/${MAX_METHODS}`} />
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
        variant="dashed"
        block
        icon={<Plus />}
        disabled={definition.methods.length >= MAX_METHODS}
        onClick={() => doc().commit({ definition: addMethod(doc().definition) })}
      >
        Add method
      </Button>
    </section>
  );
};
