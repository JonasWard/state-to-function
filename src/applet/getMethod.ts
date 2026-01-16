import { JavascriptOperation } from '../method/renderers/methodType';
import { IfMethodTypes } from '../modelDefinition/newModel';
import {
  methodInputType,
  methodOutputType,
  MethodStateData,
  MethodType,
  numericInputType,
  InputNumber
} from './methodDataType';

const getVariableString = (v: methodOutputType | numericInputType) =>
  `${v.state.slice(0, 1)}${v.state === 'methodOutput' ? v.methodOutput : v.numericInput}`;

const parseMethodInputType = (mi: methodInputType) => {
  switch (mi.state) {
    case 'hardcoded':
      return mi.inlineInput;
    case 'methodOutput':
    case 'numericInput':
      return getVariableString(mi);
    default:
      return parseMethodFlat(mi);
  }
};

const parseIfMethod = (m: MethodType & { method: { state: (typeof IfMethodTypes)[number] } }) => {
  try {
    const [a, b, c, d] = m.method.values.map(parseMethodInputType);
    return `(${a} ${JavascriptOperation[m.method.state]} ${b} ? ${c} : ${d})`;
  } catch (e) {
    console.error(m);
    return '';
  }
};

const parseMethodFlat = (m: MethodType) => {
  try {
    if (IfMethodTypes.includes(m.method.state as (typeof IfMethodTypes)[number]))
      return parseIfMethod(m as MethodType & { method: { state: (typeof IfMethodTypes)[number] } });
    return '(' + m.method.values.map(parseMethodInputType).join(JavascriptOperation[m.method.state]) + ')';
  } catch (e) {
    console.error(m);
    return '';
  }
};

const getValueFromInputNumber = (input: InputNumber) => {
  switch (input.inputType.state) {
    case 'hardcoded':
      return input.inputType.inlineInput;
    case 'float':
      return input.inputType.floatValue;
    case 'integer':
      return input.inputType.integerValue;
  }
};

export const getMethod = (methodStateData: MethodStateData, variableValues: Record<string, number>): string => {
  // for now lets pretend that the input variables are actually always using their default values
  const allData: string[] = [];
  allData.push(
    ...methodStateData.inputValues.map(
      (n, i) => `n${i}=${variableValues[i] ? variableValues[i] : getValueFromInputNumber(n)};`
    )
  );
  allData.push(...methodStateData.methodValues.map((m, i) => `m${i}=${parseMethodFlat(m)};`));

  const returnObject = '[' + methodStateData.methodValues.map((m, i) => `m${i}`).join(', ') + ']';

  const fs = `{
  ${allData.join('\n')}
    return ${returnObject};
}`;

  return fs;
};

export const evalMethod = (methodStateData: MethodStateData, variableValues: Record<string, number>): number[] => {
  try {
    return new Function(getMethod(methodStateData, variableValues))();
  } catch (e) {
    console.error(e);
    return Array.from({ length: methodStateData.methodValues.length }, () => NaN);
  }
};
