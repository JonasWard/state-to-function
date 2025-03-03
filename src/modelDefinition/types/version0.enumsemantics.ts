import { AttributeNames } from '../enums/attributeNames';
import { ExtrusionCategory } from './extrusion';
import { FootprintCategory } from './footprint';
import { ProcessingMethodCategory } from './heights';
import { MainMethodLabels, PreProcessingMethodLabels } from './methodSemantics';
import { Versions } from './versions';

const processingMethodTypes = [
  { value: ProcessingMethodCategory.None, label: 'None Method' },
  { value: ProcessingMethodCategory.IncrementalMethod, label: 'Incremental Method' },
  { value: ProcessingMethodCategory.Sin, label: 'Sin Method' },
];

const floatMethodLabels = [
  AttributeNames.If,
  AttributeNames.Multiply,
  AttributeNames.Addition,
  AttributeNames.Division,
  AttributeNames.Subtraction,
  AttributeNames.Power,
];

const booleanMethodLabels = [AttributeNames.LargerThan, AttributeNames.SmallerThan, AttributeNames.Equal, AttributeNames.NotEqual];

const inputValueLabels = [AttributeNames.InputReference, AttributeNames.FloatMethod];

export const version0EnumSemantics = {
  [AttributeNames.Version]: Versions,
  [AttributeNames.FloatMethod]: floatMethodLabels.map((label, value) => ({ label, value })),
  [AttributeNames.BooleanMethod]: booleanMethodLabels.map((label, value) => ({ label, value })),
  [AttributeNames.InputValue]: inputValueLabels.map((label, value) => ({ label, value })),
};
