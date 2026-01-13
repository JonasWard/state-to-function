type descriptionType = {
  symbol: string;
  subscript: string;
  name: string;
};

type harcodedType = {
  inputType: {
    state: 'hardcoded';
    inlineInput: string;
  };
};

type floatType = {
  inputType: {
    floatValue: number;
    floatMin: number;
    floatMax: number;
    state: 'float';
  };
};

type integerType = {
  inputType: {
    integerValue: number;
    integerMin: number;
    integerMax: number;
    state: 'integer';
  };
};

export type InputNumber = descriptionType & (harcodedType | floatType | integerType);

export type methodOutputType = {
  methodOutput: number;
  state: 'methodOutput';
};

export type numericInputType = {
  numericInput: number;
  state: 'numericInput';
};

type inlineInputType = {
  inlineInput: string;
  state: 'hardcoded';
};

export type methodInputType = methodOutputType | numericInputType | inlineInputType | MethodType;

export type MethodType = {
  method: {
    values: methodInputType[];
    state: 'addition' | 'multiplication' | 'subtraction' | 'division' | 'power';
  };
  state: 'method';
};

export type MethodStateData = {
  inputValues: InputNumber[];
  methodValues: (descriptionType & MethodType)[];
};
