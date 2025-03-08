import { EnumEntryDataType, IntDataEntry } from 'url-safe-bitpacking/dist/types';
import { AttributeNames } from '../enums/attributeNames';

export type NumericReferenceType = number;

export type NumericInputType = {
  [AttributeNames.FloatMethod]: IntDataEntry;
};

export type NumericPair = { [AttributeNames.ValueA]: InputValue; [AttributeNames.ValueB]: InputValue };

export type NumericArray = {
  [AttributeNames.NumericArray]: {
    s: IntDataEntry;
    v: InputValue[];
  };
};

export type LargerThan = {
  s: EnumEntryDataType & { value: 0 };
  v: {
    [AttributeNames.LargerThan]: NumericPair;
  };
};

export type SmallerThan = {
  s: EnumEntryDataType & { value: 1 };
  v: {
    [AttributeNames.SmallerThan]: NumericPair;
  };
};

export type Equal = {
  s: EnumEntryDataType & { value: 2 };
  v: {
    [AttributeNames.Equal]: NumericPair;
  };
};

export type NotEqual = {
  s: EnumEntryDataType & { value: 3 };
  v: {
    [AttributeNames.NotEqual]: NumericPair;
  };
};

export type BooleanMethod = LargerThan | SmallerThan | Equal | NotEqual;

export type IfMethod = {
  s: EnumEntryDataType & { value: 0 };
  v: {
    [AttributeNames.If]: {
      [AttributeNames.BooleanMethod]: BooleanMethod;
      [AttributeNames.ValueA]: InputValue;
      [AttributeNames.ValueB]: InputValue;
    };
  };
};

export type MultiplyMethod = {
  s: EnumEntryDataType & { value: 1 };
  v: {
    [AttributeNames.Multiply]: NumericArray;
  };
};

export type AddMethod = {
  s: EnumEntryDataType & { value: 2 };
  v: {
    [AttributeNames.Addition]: NumericArray;
  };
};

export type DivisionMethod = {
  s: EnumEntryDataType & { value: 3 };
  v: NumericPair;
};

export type SubtractionMethod = {
  s: EnumEntryDataType & { value: 4 };
  v: NumericPair;
};

export type PowerMethod = {
  s: EnumEntryDataType & { value: 5 };
  v: NumericPair;
};

export type FloatMethod = {
  s: EnumEntryDataType & { value: 1 };
  v: {
    [AttributeNames.FloatMethod]: IfMethod | MultiplyMethod | AddMethod | DivisionMethod | SubtractionMethod | PowerMethod;
  };
};

export type InputReference = { s: EnumEntryDataType & { value: 0 }; v: { [AttributeNames.InputReference]: number } };

export type InputValue = { [AttributeNames.InputValue]: FloatMethod | InputReference };

export type TextArray = {
  s: IntDataEntry;
  v: { [AttributeNames.Character]: IntDataEntry }[];
};

export type NumericInput = {
  [AttributeNames.NumericScientificSymbol]: IntDataEntry;
  [AttributeNames.NumericScientificSubscript]: TextArray;
  [AttributeNames.NumericInputName]: TextArray;
};

export type NumericInputs = {
  s: IntDataEntry;
  v: NumericInput[];
};

export type VersionOValueType = {
  [AttributeNames.Function]: InputValue;
  [AttributeNames.NumericInputs]: NumericInputs;
};
