import { AttributeNames } from '../enums/attributeNames';

export type NumericReferenceType = number;

export type NumericInputType = {
  [AttributeNames.FloatMethod]: number;
};

export type NumericPair = { [AttributeNames.ValueA]: InputValue; [AttributeNames.ValueB]: InputValue };

export type NumericArray = {
  [AttributeNames.NumericArray]: {
    s: number;
    v: InputValue[];
  };
};

export type LargerThan = {
  s: 0;
  v: {
    [AttributeNames.LargerThan]: NumericPair;
  };
};

export type SmallerThan = {
  s: 1;
  v: {
    [AttributeNames.SmallerThan]: NumericPair;
  };
};

export type Equal = {
  s: 2;
  v: {
    [AttributeNames.Equal]: NumericPair;
  };
};

export type NotEqual = {
  s: 3;
  v: {
    [AttributeNames.NotEqual]: NumericPair;
  };
};

export type BooleanMethod = LargerThan | SmallerThan | Equal | NotEqual;

export type IfMethod = {
  s: 0;
  v: {
    [AttributeNames.If]: {
      [AttributeNames.BooleanMethod]: BooleanMethod;
      [AttributeNames.ValueA]: InputValue;
      [AttributeNames.ValueB]: InputValue;
    };
  };
};

export type MultiplyMethod = {
  s: 1;
  v: {
    [AttributeNames.Multiply]: NumericArray;
  };
};

export type AddMethod = {
  s: 2;
  v: {
    [AttributeNames.Addition]: NumericArray;
  };
};

export type DivisionMethod = {
  s: 3;
  v: NumericPair;
};

export type SubtractionMethod = {
  s: 4;
  v: NumericPair;
};

export type PowerMethod = {
  s: 5;
  v: NumericPair;
};

export type FloatMethod = {
  s: 1;
  v: {
    [AttributeNames.FloatMethod]: IfMethod | MultiplyMethod | AddMethod | DivisionMethod | SubtractionMethod | PowerMethod;
  };
};

export type InputReference = { s: 0; v: { [AttributeNames.InputReference]: number } };

export type InputValue = { [AttributeNames.InputValue]: FloatMethod | InputReference };

export type TextArray = {
  s: number;
  v: { [AttributeNames.Character]: number }[];
};

export type NumericInput = {
  [AttributeNames.NumericScientificSymbol]: number;
  [AttributeNames.NumericScientificSubscript]: TextArray;
  [AttributeNames.NumericInputName]: TextArray;
};

export type NumericInputs = {
  s: number;
  v: NumericInput[];
};

export type VersionOValueType = {
  [AttributeNames.Function]: InputValue;
  [AttributeNames.NumericInputs]: NumericInputs;
};
