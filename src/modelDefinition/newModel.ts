import {
  DataEntry,
  DataEntryFactory,
  EnumOptionsDataEntry,
  ObjectDataEntry,
  VersionDataEntry
} from 'url-safe-bitpacking';

const charsHardCodedNumbers = '0123456789-.e'.split('');
const charsSymbol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzανβξΓγΔδΠπερζΣσςητΘΦφχλψμΩω?'.split('');
const charsSubscript = 'abcdefghijklmnopqrstuvwxyz0123456789-_.,αβγεφμ+-()[]{}$*#~/<>!? '.split('');
const charsName = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 0123456789.'.split('');

export const ArrayMethodTypes = ['addition', 'multiplication'] as const;
export const PairMethodTypes = ['subtraction', 'division', 'power'] as const;
export const IfMethodTypes = ['smallerThan', 'greaterThan', 'equal'] as const;
export const SimpleMethodTypes = [...ArrayMethodTypes, ...PairMethodTypes] as const;
export const AvailableMethodsTypes = [...ArrayMethodTypes, ...PairMethodTypes, ...IfMethodTypes] as const;

const hardcodedNumber = DataEntryFactory.ENUM_ARRAY([0], charsHardCodedNumbers, 0, 31, 'inlineInput');
const symbol = DataEntryFactory.ENUM(0, charsSymbol, 'symbol');
const subscriptValue = DataEntryFactory.ENUM_ARRAY([], charsSubscript, 0, 31, 'subscript');
const name = DataEntryFactory.ENUM_ARRAY([], charsName, 0, 31, 'name');

const hardcodedInputObject = DataEntryFactory.OBJECT([hardcodedNumber], 'hardcoded');

const inputDefinition: EnumOptionsDataEntry = {
  type: 'ENUM_OPTIONS',
  state: 0,
  stateBits: 3,
  descriptor: [hardcodedInputObject],
  value: hardcodedInputObject,
  mapping: ['hardcodedNumber'],
  name: 'inputs'
};

const integerValue = DataEntryFactory.INT(0, -512, 511, 'integerValue');
const integerMin = DataEntryFactory.INT(0, -512, 511, 'integerMin');
const integerMax = DataEntryFactory.INT(100, -512, 511, 'integerMax');

const integerInputObject = DataEntryFactory.OBJECT([integerMin, integerValue, integerMax], 'integer');

const floatValue = DataEntryFactory.FLOAT(0, -5242.88, 5242.87, 2, 'floatValue');
const floatMin = DataEntryFactory.FLOAT(0, -5242.88, 5242.87, 2, 'floatMin');
const floatMax = DataEntryFactory.FLOAT(1, -5242.88, 5242.87, 2, 'floatMax');

const floatInputObject = DataEntryFactory.OBJECT([floatMin, floatValue, floatMax], 'float');

const valuesPair = DataEntryFactory.ARRAY(inputDefinition, 2, 2, 2, 'values');
const valuesExtended = DataEntryFactory.ARRAY(inputDefinition, 2, 2, 8, 'values');
const valuesQuad = DataEntryFactory.ARRAY(inputDefinition, 4, 4, 4, 'values');

const addition = DataEntryFactory.OBJECT([valuesExtended], 'addition');
const multiplication = DataEntryFactory.OBJECT([valuesExtended], 'multiplication');
const subtraction = DataEntryFactory.OBJECT([valuesPair], 'subtraction');
const division = DataEntryFactory.OBJECT([valuesPair], 'division');
const power = DataEntryFactory.OBJECT([valuesPair], 'power');
const smallerThan = DataEntryFactory.OBJECT([valuesQuad], 'smallerThan');
const greaterThan = DataEntryFactory.OBJECT([valuesQuad], 'greaterThan');
const equal = DataEntryFactory.OBJECT([valuesQuad], 'equal');

const methods: Record<(typeof AvailableMethodsTypes)[number], DataEntry> = {
  addition,
  multiplication,
  subtraction,
  division,
  power,
  smallerThan,
  greaterThan,
  equal
};

const availableMethods = Object.values(methods) as ObjectDataEntry[];

const methodDescriptor = DataEntryFactory.ENUM_OPTIONS(availableMethods, 0, 'method');

const numericInput = DataEntryFactory.INT(0, 0, 31, 'numericInput');
const methodOutput = DataEntryFactory.INT(0, 0, 31, 'methodOutput');

export const InputDefinitionTypes = ['hardcoded', 'numericInput', 'methodOutput', 'method'] as const;

const inputDefinitions: Record<(typeof InputDefinitionTypes)[number], ObjectDataEntry> = {
  hardcoded: hardcodedInputObject,
  numericInput: DataEntryFactory.OBJECT([numericInput], 'numericInput'),
  methodOutput: DataEntryFactory.OBJECT([methodOutput], 'methodOutput'),
  method: DataEntryFactory.OBJECT([methodDescriptor], 'method')
} as const;

// reinitializing an inputDefinition object
const iDB = DataEntryFactory.ENUM_OPTIONS(Object.values(inputDefinitions), inputDefinition.state, inputDefinition.name);
inputDefinition.descriptor = iDB.descriptor;
inputDefinition.stateBits = iDB.stateBits;
inputDefinition.value = iDB.value;
inputDefinition.mapping = iDB.mapping;

const nameData = [symbol, subscriptValue, name] as const;

const inputValueValue = DataEntryFactory.ENUM_OPTIONS(
  [hardcodedInputObject, integerInputObject, floatInputObject],
  0,
  'inputType'
);

const inputValueObject = DataEntryFactory.OBJECT([...nameData, inputValueValue], 'inputs');

const inputMethodObject = DataEntryFactory.OBJECT([...nameData, methodDescriptor], 'method');

export const ModelStateDescriptor = [
  DataEntryFactory.VERSION(0, 8, 'version'),
  DataEntryFactory.ARRAY(inputValueObject, 2, 1, 31, 'inputValues'),
  DataEntryFactory.ARRAY(inputMethodObject, 2, 0, 31, 'methodValues')
] as [VersionDataEntry, ...DataEntry[]];
