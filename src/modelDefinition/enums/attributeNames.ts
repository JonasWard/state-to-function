export enum AttributeNames {
  If = 'if',
  ValueA = 'a',
  ValueB = 'b',
  LargerThan = '>',
  SmallerThan = '<',
  Equal = '=',
  NotEqual = '!=',
  Multiply = '×',
  Division = '/',
  Addition = '+',
  Subtraction = '-',
  Power = '^',
  InputNumber = 'I',
  BooleanMethod = 'Mb',
  FloatMethod = 'Mf',
  InputFields = 'Input Fields',
  StaticValue = 'Static Value',
  InputValue = 'Input Value',
  InputName = 'Input Name',
  InputReference = 'Input Reference',
  NumericArray = 'Numeric Array',
  Function = 'Function',
  FunctionArray = 'Function Array',
  FunctionOutput = 'Function Output',
  Version = 'version',
  NumericInputs = 'Numeric Inputs',
  NumericInputVariable = 'Variable',
  NumericInputValue = 'Value',
  NumericInputName = 'Name',
  NumericScientificSymbol = 'Symbol',
  NumericScientificSubscript = 'Subscript',
  Character = 'c',
  Hardcoded = 'Hardcoded',
}

export type BooleanAttributes = AttributeNames.LargerThan | AttributeNames.SmallerThan | AttributeNames.Equal | AttributeNames.NotEqual;
export type FloatAttributes =
  | AttributeNames.If
  | AttributeNames.Multiply
  | AttributeNames.Division
  | AttributeNames.Addition
  | AttributeNames.Subtraction
  | AttributeNames.Power;
