import { DataEntryFactory } from 'url-safe-bitpacking';
import { AttributeNames } from '../enums/attributeNames';
import { ArrayEntryDataType, EnumEntryDataType, SingleLevelContentType } from 'url-safe-bitpacking/dist/types';

const floatMethod: SingleLevelContentType = [AttributeNames.FloatMethod, []];
const numericField: SingleLevelContentType = [AttributeNames.InputValue, []];

const inputVariableCount = DataEntryFactory.createInt(0, 0, 36, AttributeNames.InputReference);
const numericFieldArrayContent: ArrayEntryDataType = [[2, 8], [numericField]];
const numericFieldArray: SingleLevelContentType = [AttributeNames.NumericArray, numericFieldArrayContent];

const valueA: SingleLevelContentType = [AttributeNames.ValueA, [numericField]];
const valueB: SingleLevelContentType = [AttributeNames.ValueB, [numericField]];
const valuePair: SingleLevelContentType[] = [valueA, valueB];

const largetThanMethod: SingleLevelContentType = [AttributeNames.LargerThan, valuePair];
const smallerThanMethod: SingleLevelContentType = [AttributeNames.SmallerThan, valuePair];
const equalMethod: SingleLevelContentType = [AttributeNames.Equal, valuePair];
const notEqualMethod: SingleLevelContentType = [AttributeNames.NotEqual, valuePair];

const booleanMethodContent: EnumEntryDataType = [0, [largetThanMethod], [smallerThanMethod], [equalMethod], [notEqualMethod]];
const booleanMethod: SingleLevelContentType = [AttributeNames.BooleanMethod, booleanMethodContent];

const ifMethod: SingleLevelContentType = [AttributeNames.If, [booleanMethod, valueA, valueB]];
const multiplyMethod: SingleLevelContentType = [AttributeNames.Multiply, [numericFieldArray]];
const addMethod: SingleLevelContentType = [AttributeNames.Addition, [numericFieldArray]];
const divisionMethod: SingleLevelContentType = [AttributeNames.Division, valuePair];
const subtractionMethod: SingleLevelContentType = [AttributeNames.Subtraction, valuePair];
const powerMethod: SingleLevelContentType = [AttributeNames.Power, valuePair];

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
