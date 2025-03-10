import { AttributeNames } from '../modelDefinition/enums/attributeNames';
import {
  AddMethod,
  BooleanMethod,
  FloatMethod,
  IfMethod,
  InputValue,
  MethodEntry,
  MultiplyMethod,
  NumericPair,
  VersionODataType,
} from '../modelDefinition/types/version0.data.type';

const simplePairRenderer = (numericPair: NumericPair, operator: string): string =>
  `${InputValueRenderer(numericPair.a)}${operator}${InputValueRenderer(numericPair.b)}`;

const divisionPairRenderer = (numericPair: NumericPair): string => simplePairRenderer(numericPair, '/');

const powerPairRenderer = (numericPair: NumericPair): string => simplePairRenderer(numericPair, '**');

const BooleanMethodRender = (booleanMethod: BooleanMethod): string => {
  const numericPair = Object.values(booleanMethod.v)[0];
  const comparator = Object.keys(booleanMethod.v)[0];

  return simplePairRenderer(numericPair, comparator);
};

const IfRenderer = (ifMethod: IfMethod): string =>
  `((${BooleanMethodRender(ifMethod.v.if.Mb)}) ?${InputValueRenderer(ifMethod.v.if.a)}:${InputValueRenderer(ifMethod.v.if.b)})`;

const NumericArrayRenderer = (arrayMethod: AddMethod | MultiplyMethod): string => {
  const numericArray = Object.values(arrayMethod.v)[0];
  const operator = Object.keys(arrayMethod.v)[0];

  return numericArray[AttributeNames.NumericArray].v.map((v) => InputValueRenderer(v)).join(operator === '×' ? '*' : operator);
};

const InternalMethodRenderer = (floatMethod: FloatMethod): string => {
  switch (floatMethod.v.Mf.s.value) {
    case 0: // if method
      return IfRenderer(floatMethod.v.Mf as IfMethod);
    case 1: // multiply method
    case 2: // add method
      return NumericArrayRenderer(floatMethod.v.Mf as AddMethod | MultiplyMethod);
    case 3: // division method
      return divisionPairRenderer(floatMethod.v.Mf.v[AttributeNames.Division]);
    case 4: // subtraction method
      return simplePairRenderer(floatMethod.v.Mf.v[AttributeNames.Subtraction], AttributeNames.Subtraction);
    case 5: // power method
      return powerPairRenderer(floatMethod.v.Mf.v[AttributeNames.Power]);
  }
};

const InputValueRenderer = (inputValue: InputValue): string => {
  if (inputValue[AttributeNames.InputValue].s.value === 0) return `input${inputValue[AttributeNames.InputValue].v[AttributeNames.InputReference].value}`;
  else return InternalMethodRenderer(inputValue[AttributeNames.InputValue] as FloatMethod);
};

const constructMethod = (method: MethodEntry) => InputValueRenderer(method[AttributeNames.Function]);

export const createMethod = (dataObject: VersionODataType): ((inputValues: number[]) => { [output: string]: number }) => {
  // storing all the input variables in a unique string
  const inputs: string[] = dataObject[AttributeNames.NumericInputs].v.map((value, index) => `input${index}`);
  const methods: [string, string][] = dataObject[AttributeNames.FunctionArray].v.map((method, index) => [`${index}`, constructMethod(method)]);

  const methodContent =
    inputs.map((name, index) => `const ${name} = numbers[${index}];`).join('\n') +
    `\nreturn{
  ${methods.map(([v, methodString]) => `${v}: ${methodString}`).join(',\n')}
};`;

  console.log(methodContent);

  return Function('numbers', methodContent) as (numbers: number[]) => { [id: string]: number };
};
