import React from 'react';
import { useMethodData } from '../../state/method';
import {
  AddMethod,
  BooleanMethod,
  FloatMethod,
  IfMethod,
  InputValue,
  MultiplyMethod,
  NumericInput,
  NumericInputs,
  NumericPair,
  InputReference,
  MethodEntry,
  VersionODataType,
} from '../../modelDefinition/types/version0.data.type';
import { AttributeNames, BooleanAttributes, FloatAttributes } from '../../modelDefinition/enums/attributeNames';
import { DataEntryArray, EnumDataEntry, StateDataType } from 'url-safe-bitpacking/dist/types';
import { booleanMethodLabels, floatMethodLabels } from '../../modelDefinition/types/version0.enumsemantics';
import { DeleteFilled, PlusCircleFilled } from '@ant-design/icons';
import { MethodOutputEditor } from './ReferenceInputEditor';
import { Select, Tag, Switch } from 'antd';
import { SymbolRenderer } from './SymbolRenderer';
import { SubscriptRenderer } from './SubscriptRenderer';
import { getDataEntryArray } from 'url-safe-bitpacking';

const sharedRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  paddingLeft: 8,
};

const boundaryBoxStyle: React.CSSProperties = {
  margin: '0 -4px',
  backgroundColor: '#00000022',
  border: '1px solid white',
  borderRadius: 4,
};

const sharedRowStyleWithBorder: React.CSSProperties = {
  ...sharedRowStyle,
  ...boundaryBoxStyle,
  padding: 4,
  paddingLeft: 8,
};

const inputsOnGrid: React.CSSProperties = {
  display: 'grid',
  padding: 4,
  paddingLeft: 8,
  gap: 4,
  gridTemplateColumns: '45px 1fr',
};

const methodOnGrid: React.CSSProperties = {
  display: 'grid',
  padding: 4,
  paddingLeft: 8,
  gap: 4,
  gridTemplateColumns: '18px 1fr',
};

const operatorStyling: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'end',
  transform: 'translateY(9px)',
};

const floatPairs = [AttributeNames.Division, AttributeNames.Subtraction, AttributeNames.Power];
const floatArray = [AttributeNames.Multiply, AttributeNames.Addition];

const simpleFloatUpdate = (stateData: StateDataType, currentString: string, replacementString: string, newIdentifier: EnumDataEntry) => {
  useMethodData.getState().updateDataEntry([
    newIdentifier,
    ...getDataEntryArray(stateData)
      .slice(1)
      .map((d) => ({ ...d, internalName: d.internalName!.replace(currentString, replacementString) })),
  ]);
};

const ARRAY_ENTRIES_STRING = `_${AttributeNames.NumericArray}_${AttributeNames.NumericArray}_${AttributeNames.NumericArray}`;
const ARRAY_ENTRIES_0 = `${ARRAY_ENTRIES_STRING}_0`;
const ARRAY_ENTRIES_1 = `${ARRAY_ENTRIES_STRING}_1`;
const PAIR_A = '_a';
const PAIR_B = '_b';

const updateBasedOnFromToStringPairs = (dataEntries: DataEntryArray, fromtToStringPairs: [string, string][], newIdentifier: EnumDataEntry) =>
  useMethodData
    .getState()
    .updateDataEntry([
      newIdentifier,
      ...fromtToStringPairs
        .map(([from, to]) => dataEntries.filter((d) => d.internalName?.includes(from)).map((d) => ({ ...d, internalName: d.internalName!.replace(from, to) })))
        .flat(),
    ]);

const arrayToPairUpdate = (stateData: StateDataType, currentString: string, replacementString: string, newIdentifier: EnumDataEntry) => {
  const otherDataEntries = getDataEntryArray(stateData).slice(1);

  const fromToStringPairs: [string, string][] = [
    [currentString + ARRAY_ENTRIES_0, replacementString + PAIR_A],
    [currentString + ARRAY_ENTRIES_1, replacementString + PAIR_B],
  ];

  updateBasedOnFromToStringPairs(otherDataEntries, fromToStringPairs, newIdentifier);
};

const pairToArrayUpdate = (stateData: StateDataType, currentString: string, replacementString: string, newIdentifier: EnumDataEntry) => {
  const otherDataEntries = getDataEntryArray(stateData).slice(1);

  const fromToStringPairs: [string, string][] = [
    [currentString + PAIR_A, replacementString + ARRAY_ENTRIES_0],
    [currentString + PAIR_B, replacementString + ARRAY_ENTRIES_1],
  ];

  updateBasedOnFromToStringPairs(otherDataEntries, fromToStringPairs, newIdentifier);
};

const changeFloatMethodType = (floatMethod: FloatMethod, newValue: 0 | 1 | 2 | 3 | 4 | 5) => {
  const newDescriptionEntry = { ...floatMethod.v[AttributeNames.FloatMethod].s, value: newValue } as EnumDataEntry;
  const currentOperator = floatMethodLabels[floatMethod.v[AttributeNames.FloatMethod].s.value] as FloatAttributes;
  const newOperator = floatMethodLabels[newValue];

  const descriptionStringToReplace = `${floatMethod.v[AttributeNames.FloatMethod].s.internalName!}_${currentOperator}`;

  // simple case
  if (
    (floatPairs.includes(currentOperator) && floatPairs.includes(newOperator)) ||
    (floatArray.includes(currentOperator) && floatArray.includes(newOperator)) ||
    (currentOperator === AttributeNames.If && floatPairs.includes(newOperator)) ||
    (floatPairs.includes(currentOperator) && newOperator === AttributeNames.If)
  ) {
    const replaceStringWith = `${floatMethod.v[AttributeNames.FloatMethod].s.internalName!}_${newOperator}`;
    simpleFloatUpdate(floatMethod.v[AttributeNames.FloatMethod], descriptionStringToReplace, replaceStringWith, newDescriptionEntry);
  } else {
    // if to pair
    if (
      (currentOperator === AttributeNames.If && floatArray.includes(newOperator)) ||
      (floatPairs.includes(currentOperator) && floatArray.includes(newOperator))
    ) {
      const replaceStringWith = `${floatMethod.v[AttributeNames.FloatMethod].s.internalName!}_${newOperator}`;
      pairToArrayUpdate(floatMethod.v[AttributeNames.FloatMethod], descriptionStringToReplace, replaceStringWith, newDescriptionEntry);
    } else if (
      (floatArray.includes(currentOperator) && newOperator === AttributeNames.If) ||
      (floatArray.includes(currentOperator) && floatPairs.includes(newOperator))
    ) {
      const replaceStringWith = `${floatMethod.v[AttributeNames.FloatMethod].s.internalName!}_${newOperator}`;
      arrayToPairUpdate(floatMethod.v[AttributeNames.FloatMethod], descriptionStringToReplace, replaceStringWith, newDescriptionEntry);
    } else useMethodData.getState().updateDataEntry(newDescriptionEntry);
  }
};

const FloatMethodSelector: React.FC<{ floatMethod: FloatMethod }> = ({ floatMethod }) => (
  <Select
    variant='filled'
    style={{ paddingLeft: 8 }}
    onChange={(value) => changeFloatMethodType(floatMethod, value)}
    value={floatMethod.v[AttributeNames.FloatMethod].s.value}
  >
    {floatMethodLabels.map((label, value) => (
      <Select.Option key={label} value={value}>
        {label}
      </Select.Option>
    ))}
  </Select>
);

const changeBooleanMethodType = (booleanMethod: BooleanMethod, newValue: 0 | 1 | 2 | 3) => {
  const newDescriptionEntry = { ...booleanMethod.s, value: newValue } as EnumDataEntry;
  const currentOperator = booleanMethodLabels[booleanMethod.s.value] as BooleanAttributes;
  const newOperator = booleanMethodLabels[newValue];

  const descriptionStringToReplace = `${booleanMethod.s.internalName!}_${currentOperator}`;
  const replaceStringWith = `${booleanMethod.s.internalName!}_${newOperator}`;

  const otherDataEntries = getDataEntryArray(booleanMethod).slice(1);
  useMethodData
    .getState()
    .updateDataEntry([
      newDescriptionEntry,
      ...otherDataEntries.map((d) => ({ ...d, internalName: d.internalName!.replace(descriptionStringToReplace, replaceStringWith) })),
    ]);
};

const BooleanMethodSelect: React.FC<{ booleanMethod: BooleanMethod }> = ({ booleanMethod }) => (
  <Select variant='filled' style={{ paddingLeft: 8 }} onChange={(value) => changeBooleanMethodType(booleanMethod, value)} value={booleanMethod.s.value}>
    {booleanMethodLabels.map((label, value) => (
      <Select.Option key={label} value={value}>
        {label}
      </Select.Option>
    ))}
  </Select>
);

const pairRenderer = (numericPair: NumericPair, operator: string, numericInputs: NumericInputs, withBox: boolean = false) => (
  <span style={withBox ? { ...methodOnGrid, ...boundaryBoxStyle } : methodOnGrid}>
    <span style={operatorStyling}>{operator}</span>
    <InputValueRenderer inputValue={numericPair.a} numericInputs={numericInputs} />
    <div />
    <InputValueRenderer inputValue={numericPair.b} numericInputs={numericInputs} />
  </span>
);

const BooleanMethodRender: React.FC<{ booleanMethod: BooleanMethod; numericInputs: NumericInputs }> = ({ booleanMethod, numericInputs }) => {
  const numericPair = Object.values(booleanMethod.v)[0];

  return (
    <span style={{ ...methodOnGrid, ...boundaryBoxStyle, gridTemplateColumns: '35px 1fr' }}>
      <span style={{ transform: 'translate(-8px, 16px)' }}>
        <BooleanMethodSelect booleanMethod={booleanMethod} />
      </span>
      <InputValueRenderer inputValue={numericPair.a} numericInputs={numericInputs} />
      <div />
      <InputValueRenderer inputValue={numericPair.b} numericInputs={numericInputs} />
    </span>
  );
};

const IfRenderer: React.FC<{ ifMethod: IfMethod; numericInputs: NumericInputs }> = ({ ifMethod, numericInputs }) => (
  <span style={inputsOnGrid}>
    <span style={{ transform: 'translateY(8px)' }}>if:</span>
    <BooleanMethodRender booleanMethod={ifMethod.v.if.Mb} numericInputs={numericInputs} />
    <span style={{ transform: 'translateY(8px)' }}>then:</span>
    <InputValueRenderer inputValue={ifMethod.v.if.a} numericInputs={numericInputs} />
    <span style={{ transform: 'translateY(8px)' }}>else:</span>
    <InputValueRenderer inputValue={ifMethod.v.if.b} numericInputs={numericInputs} />
  </span>
);

const NumericArrayRenderer: React.FC<{ arrayMethod: AddMethod | MultiplyMethod; numericInputs: NumericInputs }> = ({ arrayMethod, numericInputs }) => {
  const numericArray = Object.values(arrayMethod.v)[0];
  const operator = Object.keys(arrayMethod.v)[0];

  return (
    <span style={methodOnGrid}>
      {numericArray[AttributeNames.NumericArray].v.map((v, i, arr) => (
        <>
          {i !== arr.length - 1 ? (
            <span key={'operator-' + i} style={operatorStyling}>
              {operator}
            </span>
          ) : (
            <div key={'placeholder-' + i} />
          )}
          <span key={i} style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <InputValueRenderer inputValue={v} numericInputs={numericInputs} />
            {numericArray[AttributeNames.NumericArray].s.value > numericArray[AttributeNames.NumericArray].s.min &&
            i + 1 === numericArray[AttributeNames.NumericArray].s.value ? (
              <DeleteFilled
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  useMethodData
                    .getState()
                    .updateDataEntry({ ...numericArray[AttributeNames.NumericArray].s, value: numericArray[AttributeNames.NumericArray].s.value - 1 })
                }
              />
            ) : null}
          </span>
        </>
      ))}
      {numericArray[AttributeNames.NumericArray].s.value < numericArray[AttributeNames.NumericArray].s.max ? (
        <>
          <span key={'addFiller'} />
          <PlusCircleFilled
            style={{ cursor: 'pointer' }}
            key={'add'}
            onClick={() =>
              useMethodData
                .getState()
                .updateDataEntry({ ...numericArray[AttributeNames.NumericArray].s, value: numericArray[AttributeNames.NumericArray].s.value + 1 })
            }
          />
        </>
      ) : null}
    </span>
  );
};

const InternalMethodRenderer: React.FC<{ floatMethod: FloatMethod; numericInputs: NumericInputs }> = ({ floatMethod, numericInputs }) => {
  switch (floatMethod.v.Mf.s.value) {
    case 0: // if method
      return <IfRenderer ifMethod={floatMethod.v.Mf as IfMethod} numericInputs={numericInputs} />;
    case 1: // multiply method
    case 2: // add method
      return <NumericArrayRenderer arrayMethod={floatMethod.v.Mf as AddMethod | MultiplyMethod} numericInputs={numericInputs} />;
    case 3: // division method
      return pairRenderer(floatMethod.v.Mf.v[AttributeNames.Division], AttributeNames.Division, numericInputs);
    case 4: // subtraction method
      return pairRenderer(floatMethod.v.Mf.v[AttributeNames.Subtraction], AttributeNames.Subtraction, numericInputs);
    case 5: // power method
      return pairRenderer(floatMethod.v.Mf.v[AttributeNames.Power], AttributeNames.Power, numericInputs);
  }
};

const NumericInputRenderer: React.FC<{ numericInput: NumericInput }> = ({ numericInput }) => {
  return (
    <var>
      <SymbolRenderer symbol={numericInput[AttributeNames.NumericScientificSymbol].value} />
      <SubscriptRenderer subscriptIndexes={numericInput.Subscript} />
    </var>
  );
};

const NumericInputsSelector: React.FC<{ numericInputs: NumericInputs; inputReference: InputReference }> = ({ numericInputs, inputReference }) => (
  <Select
    variant='filled'
    style={{ paddingLeft: 8 }}
    value={inputReference.v[AttributeNames.InputReference].value}
    onChange={(value) => useMethodData.getState().updateDataEntry({ ...inputReference.v[AttributeNames.InputReference], value } as EnumDataEntry)}
  >
    {numericInputs.v.map((n, i) => (
      <Select.Option key={i} value={i}>
        <NumericInputRenderer numericInput={n} />
      </Select.Option>
    ))}
    {numericInputs.v.length - 1 < inputReference.v[AttributeNames.InputReference].value ? (
      <Select.Option value={undefined}>
        <Tag color='red'>missing</Tag>
      </Select.Option>
    ) : null}
  </Select>
);

const InputValueRenderer: React.FC<{ inputValue: InputValue; numericInputs: NumericInputs }> = ({ inputValue, numericInputs }) =>
  inputValue[AttributeNames.InputValue].s.value === 0 ? (
    <div>
      <Switch
        checked={Boolean(inputValue[AttributeNames.InputValue].s.value)}
        unCheckedChildren={'n'}
        checkedChildren={'f'}
        onChange={(v) => useMethodData.getState().updateDataEntry({ ...inputValue[AttributeNames.InputValue].s, value: v ? 1 : 0 } as EnumDataEntry)}
      />
      <NumericInputsSelector numericInputs={numericInputs} inputReference={inputValue[AttributeNames.InputValue] as InputReference} />
    </div>
  ) : (
    <div style={sharedRowStyleWithBorder}>
      <span>
        <Switch
          checked={Boolean(inputValue[AttributeNames.InputValue].s.value)}
          unCheckedChildren={'n'}
          checkedChildren={'f'}
          onChange={(v) => useMethodData.getState().updateDataEntry({ ...inputValue[AttributeNames.InputValue].s, value: v ? 1 : 0 } as EnumDataEntry)}
        />
        <FloatMethodSelector floatMethod={inputValue[AttributeNames.InputValue] as FloatMethod} />
      </span>
      <InternalMethodRenderer floatMethod={inputValue[AttributeNames.InputValue] as FloatMethod} numericInputs={numericInputs} />
    </div>
  );

export const EditMethodContentRenderer: React.FC<{ method: MethodEntry }> = ({ method }) => {
  const data = useMethodData((s) => s.data) as VersionODataType;

  return (
    <>
      <MethodOutputEditor methodName={method[AttributeNames.FunctionOutput]} />
      <InputValueRenderer inputValue={method[AttributeNames.Function]} numericInputs={data[AttributeNames.NumericInputs]} />
    </>
  );
};
