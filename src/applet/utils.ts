import { DataEntry, DataEntryFactory } from 'url-safe-bitpacking';
import { InputNumber } from './methodDataType';

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
