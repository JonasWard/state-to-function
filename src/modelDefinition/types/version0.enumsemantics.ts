import { AttributeNames } from '../enums/attributeNames';
import { validScientificSymbols } from '../enums/chars';
import { Versions } from './versions';

const floatMethodLabels = [
  AttributeNames.If,
  AttributeNames.Multiply,
  AttributeNames.Addition,
  AttributeNames.Division,
  AttributeNames.Subtraction,
  AttributeNames.Power,
];

const booleanMethodLabels = [AttributeNames.LargerThan, AttributeNames.SmallerThan, AttributeNames.Equal, AttributeNames.NotEqual];

const inputValueLabels = [AttributeNames.InputReference, AttributeNames.FloatMethod];

export const version0EnumSemantics = {
  [AttributeNames.Version]: Versions,
  [AttributeNames.FloatMethod]: floatMethodLabels.map((label, value) => ({ label, value })),
  [AttributeNames.BooleanMethod]: booleanMethodLabels.map((label, value) => ({ label, value })),
  [AttributeNames.InputValue]: inputValueLabels.map((label, value) => ({ label, value })),
  [AttributeNames.NumericScientificSymbol]: Object.values(validScientificSymbols).map((label, value) => ({ label, value })),
};
