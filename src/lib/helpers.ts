import { EnumDataEntry } from 'url-safe-bitpacking/dist/types';
import { AttributeNames } from '../modelDefinition/enums/attributeNames';

export const getText = (text: { [AttributeNames.Character]: EnumDataEntry }[], sourceString: string) =>
  text.map((i) => sourceString[i[AttributeNames.Character].value]).join('');
