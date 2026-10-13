// The only module that imports url-safe-bitpacking; it is loaded on demand for links made before the densing switch.
import { DataEntry, DataEntryFactory, FromState, getStateData, VersionDataEntry } from 'url-safe-bitpacking';
import { AppletOverrides, Definition } from '../model/types';
import { convertLegacyApplet, convertLegacyDefinition } from './convert';
import { MethodStateData } from './legacyTypes';
import { ModelStateDescriptor } from './oldModel';

const ROOT_NODE_NAME = 'ROOT_NODE';

export type LegacyResult =
  | { ok: true; definition: Definition; overrides: AppletOverrides; appletOk: boolean }
  | { ok: false; error: unknown };

const appletEntries = (data: MethodStateData): DataEntry[] =>
  data.inputValues.flatMap(({ inputType: t }, i): DataEntry[] => {
    switch (t.state) {
      case 'hardcoded':
        return [];
      case 'float':
        return [DataEntryFactory.FLOAT(t.floatValue, t.floatMin, t.floatMax, 2, `f${i}`)];
      case 'integer':
        return [DataEntryFactory.INT(t.integerValue, t.integerMin, t.integerMax, `i${i}`)];
    }
  });

export const decodeLegacy = (definitionString: string, appletString?: string): LegacyResult => {
  let data: MethodStateData;
  let definition: Definition;
  try {
    data = getStateData(FromState(ModelStateDescriptor, ROOT_NODE_NAME, definitionString).toDataEntry()) as MethodStateData;
    definition = convertLegacyDefinition(data);
  } catch (error) {
    return { ok: false, error };
  }
  const empty = definition.inputs.map(() => null);
  if (!appletString) return { ok: true, definition, overrides: empty, appletOk: true };
  try {
    const entries = appletEntries(data) as [VersionDataEntry, ...DataEntry[]];
    const values = getStateData(FromState(entries, ROOT_NODE_NAME, appletString).toDataEntry()) as Record<string, number>;
    return { ok: true, definition, overrides: convertLegacyApplet(definition, values), appletOk: true };
  } catch {
    return { ok: true, definition, overrides: empty, appletOk: false };
  }
};
