import { BooleanDataEntry, FloatDataEntry, VersionData } from 'url-safe-bitpacking/dist/types';
import { AttributeNames } from '../enums/attributeNames';

export type VersionAppletDataType = {
  [v: number]: {
    [AttributeNames.Hardcoded]: BooleanDataEntry;
    [AttributeNames.NumericInputValue]: FloatDataEntry;
  };
  [AttributeNames.Version]: VersionData;
};
