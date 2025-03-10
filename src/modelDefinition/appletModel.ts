import { SingleLevelContentType, VersionHandler } from 'url-safe-bitpacking/dist/types';
import { VersionODataType } from './types/version0.data.type';
import { AttributeNames } from './enums/attributeNames';
import { createParserObject } from 'url-safe-bitpacking';

export const getAppletVersionHandler = (data: VersionODataType): VersionHandler => {
  console.log(data[AttributeNames.NumericInputs].v);
  const inputArray: SingleLevelContentType[] = data[AttributeNames.NumericInputs].v.map(
    (numericInput, index) => [String(index), [numericInput[AttributeNames.Hardcoded], numericInput[AttributeNames.NumericInputValue]]] as SingleLevelContentType
  );

  return createParserObject([inputArray], 1);
};
