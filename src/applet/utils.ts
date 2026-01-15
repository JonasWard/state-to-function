import {
  DataEntry,
  DataEntryFactory,
  FromState,
  getStateData,
  GetStateNodeTree,
  SpecificTypeNode,
  VersionDataEntry
} from 'url-safe-bitpacking';
import { InputNumber, MethodStateData } from './methodDataType';
import { ROOT_NODE_NAME } from '../state/c';
import { ModelStateDescriptor } from '../modelDefinition/newModel';

const getDataEntryForNumericInputs = (input: InputNumber, index: number) => {
  switch (input.inputType.state) {
    case 'hardcoded':
      return Number(input.inputType.inlineInput);
    case 'float':
      return DataEntryFactory.FLOAT(
        input.inputType.floatValue,
        input.inputType.floatMin,
        input.inputType.floatMax,
        2,
        `${input.inputType.state.slice(0, 1)}${index}`
      );
    case 'integer':
      return DataEntryFactory.INT(
        input.inputType.integerValue,
        input.inputType.integerMin,
        input.inputType.integerMax,
        `${input.inputType.state.slice(0, 1)}${index}`
      );
  }
};

export const getStateDataForNumericInputs = (inputs: InputNumber[]) => {
  const indexMapping: number[] = [];
  const dataEntries: DataEntry[] = [];
  inputs.forEach((input, index) => {
    const dataEntry = getDataEntryForNumericInputs(input, index);
    if (typeof dataEntry === 'number') return;

    indexMapping.push(index);
    dataEntries.push(dataEntry);
  });
  return {
    indexMapping,
    dataEntries
  };
};

/**
 * Helper method that tries to parse the provided base string, if it fails, falls back to the default string (surface volume and surface area of a box)
 * @param base64string
 */
export const getStateNodeForDataString = (
  stateModelDescriptor: DataEntry[],
  base64string: string | undefined | null
): SpecificTypeNode => {
  if (!base64string)
    return GetStateNodeTree(stateModelDescriptor as [VersionDataEntry, ...DataEntry[]], ROOT_NODE_NAME);
  try {
    return FromState(stateModelDescriptor as [VersionDataEntry, ...DataEntry[]], ROOT_NODE_NAME, base64string);
  } catch (e) {
    console.error(e);
    return GetStateNodeTree(stateModelDescriptor as [VersionDataEntry, ...DataEntry[]], ROOT_NODE_NAME);
  }
};

export const getMethodStateData = (base64MethodStateString: string) =>
  getStateData(
    FromState(ModelStateDescriptor, ROOT_NODE_NAME, base64MethodStateString).toDataEntry()
  ) as MethodStateData;
