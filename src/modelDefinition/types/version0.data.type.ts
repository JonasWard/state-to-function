import { BooleanDataEntry, EnumDataEntry, FloatDataEntry, IntDataEntry } from 'url-safe-bitpacking/dist/types';
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
  s: EnumDataEntry & { value: 0 };
  v: {
    [AttributeNames.LargerThan]: NumericPair;
  };
};

export type SmallerThan = {
  s: EnumDataEntry & { value: 1 };
  v: {
    [AttributeNames.SmallerThan]: NumericPair;
  };
};

export type Equal = {
  s: EnumDataEntry & { value: 2 };
  v: {
    [AttributeNames.Equal]: NumericPair;
  };
};

export type NotEqual = {
  s: EnumDataEntry & { value: 3 };
  v: {
    [AttributeNames.NotEqual]: NumericPair;
  };
};

export type BooleanMethod = LargerThan | SmallerThan | Equal | NotEqual;

export type IfMethod = {
  s: EnumDataEntry & { value: 0 };
  v: {
    [AttributeNames.If]: {
      [AttributeNames.BooleanMethod]: BooleanMethod;
      [AttributeNames.ValueA]: InputValue;
      [AttributeNames.ValueB]: InputValue;
    };
  };
};

export type MultiplyMethod = {
  s: EnumDataEntry & { value: 1 };
  v: {
    [AttributeNames.Multiply]: NumericArray;
  };
};

export type AddMethod = {
  s: EnumDataEntry & { value: 2 };
  v: {
    [AttributeNames.Addition]: NumericArray;
  };
};

export type DivisionMethod = {
  s: EnumDataEntry & { value: 3 };
  v: NumericPair;
};

export type SubtractionMethod = {
  s: EnumDataEntry & { value: 4 };
  v: NumericPair;
};

export type PowerMethod = {
  s: EnumDataEntry & { value: 5 };
  v: NumericPair;
};

export type FloatMethod = {
  s: EnumDataEntry & { value: 1 };
  v: {
    [AttributeNames.FloatMethod]: IfMethod | MultiplyMethod | AddMethod | DivisionMethod | SubtractionMethod | PowerMethod;
  };
};

export type InputReference = { s: EnumDataEntry & { value: 0 }; v: { [AttributeNames.InputReference]: EnumDataEntry } };

export type InputValue = { [AttributeNames.InputValue]: FloatMethod | InputReference };

export type TextArray = {
  s: IntDataEntry;
  v: { [AttributeNames.Character]: EnumDataEntry }[];
};

export type NumericInput = {
  [AttributeNames.NumericScientificSymbol]: EnumDataEntry;
  [AttributeNames.NumericScientificSubscript]: TextArray;
  [AttributeNames.NumericInputName]: TextArray;
  [AttributeNames.Hardcoded]: BooleanDataEntry;
  [AttributeNames.NumericInputValue]: FloatDataEntry;
};

export type NumericInputs = {
  s: IntDataEntry;
  v: NumericInput[];
};

export type VersionODataType = {
  [AttributeNames.Function]: InputValue;
  [AttributeNames.NumericInputs]: NumericInputs;
};
