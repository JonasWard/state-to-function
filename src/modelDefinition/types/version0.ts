import { DataEntryFactory } from 'url-safe-bitpacking';
import { AttributeNames } from '../enums/attributeNames';
import { ArrayEntryDataType, EnumEntryDataType, SingleLevelContentType } from 'url-safe-bitpacking/dist/types';

const floatMethod: SingleLevelContentType = [AttributeNames.FloatMethod, []];
const numericField: SingleLevelContentType = [AttributeNames.InputValue, []];

const inputVariableCount = DataEntryFactory.createEnum(0, 36, AttributeNames.InputReference);
const numericFieldArrayContent: ArrayEntryDataType = [[2, 8], [numericField]];
const numericFieldArray: SingleLevelContentType = [AttributeNames.NumericArray, numericFieldArrayContent];

const largetThanMethod: SingleLevelContentType = [AttributeNames.LargerThan, [numericField, numericField]];
const smallerThanMethod: SingleLevelContentType = [AttributeNames.SmallerThan, [numericField, numericField]];
const equalMethod: SingleLevelContentType = [AttributeNames.Equal, [numericField, numericField]];
const notEqualMethod: SingleLevelContentType = [AttributeNames.NotEqual, [numericField, numericField]];

const booleanMethodContent: EnumEntryDataType = [0, [largetThanMethod], [smallerThanMethod], [equalMethod], [notEqualMethod]];
const booleanMethod: SingleLevelContentType = [AttributeNames.BooleanMethod, booleanMethodContent];

const ifMethod: SingleLevelContentType = [AttributeNames.If, [booleanMethod, numericField, numericField]];
const multiplyMethod: SingleLevelContentType = [AttributeNames.Multiply, [numericFieldArray]];
const addMethod: SingleLevelContentType = [AttributeNames.Addition, [numericFieldArray]];
const divisionMethod: SingleLevelContentType = [AttributeNames.Division, [numericField, numericField]];
const subtractionMethod: SingleLevelContentType = [AttributeNames.Subtraction, [numericField, numericField]];
const powerMethod: SingleLevelContentType = [AttributeNames.Power, [numericField, numericField]];

const floatMethodContent: EnumEntryDataType = [0, [ifMethod], [multiplyMethod], [addMethod], [divisionMethod], [subtractionMethod], [powerMethod]];
floatMethod[1] = floatMethodContent;

const numericFieldContent: EnumEntryDataType = [0, [inputVariableCount], [floatMethod]];
numericField[1] = numericFieldContent;

const genericText = DataEntryFactory.createEnum(63, 63, AttributeNames.Character);
const numericInputNameContent: ArrayEntryDataType = [[0, 63], [genericText]];
const numericScientificSubscript: ArrayEntryDataType = [[0, 63], [genericText]];
const numericInputName: SingleLevelContentType = [AttributeNames.NumericInputName, numericInputNameContent];
const numericInputAttributeName: SingleLevelContentType = [AttributeNames.NumericScientificSubscript, numericScientificSubscript];

const numericInputsContent: ArrayEntryDataType = [
  [2, 9],
  [
    DataEntryFactory.createEnum(63, 63, AttributeNames.NumericScientificSymbol),
    DataEntryFactory.createEnum(63, 63, AttributeNames.NumericScientificSubscript),
    numericInputName,
    numericInputAttributeName,
  ],
];

export const verionArrayDefinition0: SingleLevelContentType[] = [
  [AttributeNames.Function, [numericField]],
  [AttributeNames.NumericInputs, numericInputsContent],
];
