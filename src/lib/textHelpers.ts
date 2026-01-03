import { DataEntry, EnumArrayNode } from 'url-safe-bitpacking';

const getMapping = (textEntry: EnumArrayNode): string[] => textEntry.descriptor.mapping as string[];

export const getMappingString = (textEntry: EnumArrayNode): string => getMapping(textEntry).join('');

export const getIndexesFromText = (sourceString: string, textEntry: EnumArrayNode): number[] => {
  const mapping = getMapping(textEntry);
  const indexes: number[] = [];
  for (let i = 0; i < sourceString.length; i++) indexes.push(mapping.indexOf(sourceString[i]) ?? 63);
  return indexes;
};

export const getText = (textEntry: EnumArrayNode): string =>
  (textEntry.type === 'ENUM_ARRAY'
    ? textEntry.value.map((i) => textEntry.descriptor.mapping[i])
    : textEntry.value.map(
        (v) =>
          (v[0] as DataEntry & { type: 'ENUM'; mapping: string[] }).mapping[
            (v[0] as DataEntry & { type: 'ENUM'; mapping: string[] }).value
          ]
      )
  ).join('');
