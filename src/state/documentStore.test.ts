import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_DEFINITION } from '../model/defaults';
import { addMethod } from '../model/ops';
import { useDocumentStore } from './documentStore';

const store = () => useDocumentStore.getState();

describe('document store', () => {
  beforeEach(() => store().load(DEFAULT_DEFINITION, [], 'reset'));

  it('records commits and undoes/redoes them', () => {
    const before = store().defString;
    expect(store().updateDefinition(addMethod)).toBe(true);
    const after = store().defString;
    expect(after).not.toBe(before);
    store().undo();
    expect(store().defString).toBe(before);
    store().redo();
    expect(store().defString).toBe(after);
  });

  it('does not record unchanged state', () => {
    store().commit({ definition: structuredClone(DEFAULT_DEFINITION) });
    store().setOverride(1, 100); // equal to the default
    expect(store().history).toHaveLength(1);
  });

  it('coalesces commits sharing a key', () => {
    store().setOverride(1, 10, { coalesceKey: 'w' });
    store().setOverride(1, 20, { coalesceKey: 'w' });
    store().setOverride(1, 30, { coalesceKey: 'w' });
    expect(store().history).toHaveLength(2);
    expect(store().overrides).toEqual([null, 30, null]);
    store().undo();
    expect(store().overrides).toEqual([null, null, null]);
  });

  it('drops the redo branch on a new commit', () => {
    store().setOverride(1, 10);
    store().undo();
    store().setOverride(1, 20);
    expect(store().history.map((h) => h.overrides[1])).toEqual([null, 20]);
  });

  it('pushes loaded state onto the timeline', () => {
    store().load(addMethod(DEFAULT_DEFINITION), [], 'push');
    expect(store().historyIndex).toBe(1);
    store().undo();
    expect(store().definition.methods).toHaveLength(5);
  });
});
