import { DataEntry, DataEntryFactory, FloatNode, GetStateNodeTree, ObjectNode, VersionDataEntry } from 'url-safe-bitpacking';
import { describe, expect, it } from 'vitest';
import { encodeDefinition, peekVersion } from '../model/codec';
import { DEFAULT_DEFINITION } from '../model/defaults';
import { decodeLegacy } from './legacyDecoder';

const OLD_INITIAL =
  'ABJQGhtgneloAfSCcQ-hIGACw2uxYUAPpBOIfQkCEBrYYInoaAH0gnEPoSAoAKaKaE9GnqwCECEAEVVs9FYujT1YBCFEACkl52JLRp6sAhAiAAVK1bQno09WARgwIMICRUBnprpaFSICI';

const oldAppletString = (width: number) => {
  const entries = ['f0', 'f1', 'f2'].map((name) => DataEntryFactory.FLOAT(100, 5, 5000, 2, name));
  const tree = GetStateNodeTree(entries as [VersionDataEntry, ...DataEntry[]], 'ROOT_NODE') as ObjectNode;
  (tree.getChildren()[1] as FloatNode).updateValue(width);
  return tree.getBase64String();
};

describe('legacy links', () => {
  it('recognises the old format', () => {
    expect(peekVersion(OLD_INITIAL)).toBe(0);
  });

  it('converts the old default definition', () => {
    const result = decodeLegacy(OLD_INITIAL);
    expect(result).toEqual({ ok: true, definition: DEFAULT_DEFINITION, overrides: [null, null, null], appletOk: true });
    if (result.ok) expect(encodeDefinition(result.definition)).toBe(encodeDefinition(DEFAULT_DEFINITION));
  });

  it('converts old applet values', () => {
    expect(decodeLegacy(OLD_INITIAL, oldAppletString(250))).toMatchObject({ ok: true, overrides: [null, 250, null] });
  });

  it('keeps the definition when the applet segment is corrupt', () => {
    expect(decodeLegacy(OLD_INITIAL, '!!')).toMatchObject({ ok: true, overrides: [null, null, null], appletOk: false });
  });

  it('rejects garbage', () => {
    expect(decodeLegacy('!!').ok).toBe(false);
  });
});
