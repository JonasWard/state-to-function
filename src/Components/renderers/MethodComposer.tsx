import React from 'react';
import { useMethodData } from '../../state/method';
import {
  AddMethod,
  BooleanMethod,
  FloatMethod,
  FunctionArrayEntries,
  IfMethod,
  InputValue,
  MultiplyMethod,
  NumericInput,
  NumericInputs,
  NumericPair,
  VersionODataType,
  MethodEntry,
} from '../../modelDefinition/types/version0.data.type';
import { AttributeNames } from '../../modelDefinition/enums/attributeNames';
import { Button, Tag } from 'antd';
import { DeleteFilled, EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { SymbolRenderer } from '../inputs/SymbolRenderer';
import { SubscriptRenderer } from '../inputs/SubscriptRenderer';
import { MethodTitle } from './MethodTitle';

const sharedRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: 8,
  alignItems: 'center',
};

const sharedRowStyleWithBorder: React.CSSProperties = {
  ...sharedRowStyle,
  padding: '2px 8px',
  backgroundColor: '#00000022',
  border: '1px solid white',
  borderRadius: 4,
};

const simplePairRenderer = (numericPair: NumericPair, operator: string, numericInputs: NumericInputs) => (
  <span style={sharedRowStyle}>
    <InputValueRenderer inputValue={numericPair.a} numericInputs={numericInputs} />
    {operator}
    <InputValueRenderer inputValue={numericPair.b} numericInputs={numericInputs} />
  </span>
);

const divisionPairRenderer = (numericPair: NumericPair, numericInputs: NumericInputs) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <InputValueRenderer inputValue={numericPair.a} numericInputs={numericInputs} />
    <div style={{ height: 2, backgroundColor: 'black' }} />
    <InputValueRenderer inputValue={numericPair.b} numericInputs={numericInputs} />
  </div>
);

const powerPairRenderer = (numericPair: NumericPair, numericInputs: NumericInputs) => (
  <div style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'end' }}>
    <InputValueRenderer inputValue={numericPair.a} numericInputs={numericInputs} />
    <span style={{ paddingBottom: 8 }}>
      <InputValueRenderer inputValue={numericPair.b} numericInputs={numericInputs} />
    </span>
  </div>
);

const BooleanMethodRender: React.FC<{ booleanMethod: BooleanMethod; numericInputs: NumericInputs }> = ({ booleanMethod, numericInputs }) => {
  const numericPair = Object.values(booleanMethod.v)[0];
  const comparator = Object.keys(booleanMethod.v)[0];

  return simplePairRenderer(numericPair, comparator, numericInputs);
};

const IfRenderer: React.FC<{ ifMethod: IfMethod; numericInputs: NumericInputs }> = ({ ifMethod, numericInputs }) => (
  <span style={sharedRowStyle}>
    <span>if:</span>
    <BooleanMethodRender booleanMethod={ifMethod.v.if.Mb} numericInputs={numericInputs} />
    <span>then:</span>
    <InputValueRenderer inputValue={ifMethod.v.if.a} numericInputs={numericInputs} />
    <span>else:</span>
    <InputValueRenderer inputValue={ifMethod.v.if.b} numericInputs={numericInputs} />
  </span>
);

const NumericArrayRenderer: React.FC<{ arrayMethod: AddMethod | MultiplyMethod; numericInputs: NumericInputs }> = ({ arrayMethod, numericInputs }) => {
  const numericArray = Object.values(arrayMethod.v)[0];
  const operator = Object.keys(arrayMethod.v)[0];

  return (
    <span key={arrayMethod.s.value} style={sharedRowStyle}>
      {numericArray[AttributeNames.NumericArray].v.map((v, i, arr) =>
        i !== arr.length - 1 ? (
          <span style={sharedRowStyle} key={'operator-' + i}>
            <InputValueRenderer inputValue={v} numericInputs={numericInputs} />
            <var>{operator}</var>
          </span>
        ) : (
          <InputValueRenderer key={'inputValue-' + i} inputValue={v} numericInputs={numericInputs} />
        )
      )}
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
      return divisionPairRenderer(floatMethod.v.Mf.v[AttributeNames.Division], numericInputs);
    case 4: // subtraction method
      return simplePairRenderer(floatMethod.v.Mf.v[AttributeNames.Subtraction], AttributeNames.Subtraction, numericInputs);
    case 5: // power method
      return powerPairRenderer(floatMethod.v.Mf.v[AttributeNames.Power], numericInputs);
  }
};

const NumericInputRenderer: React.FC<{ numericInput: NumericInput }> = ({ numericInput }) => {
  return numericInput[AttributeNames.Hardcoded].value ? (
    <var>
      {Number.isInteger(numericInput[AttributeNames.NumericInputValue].value)
        ? numericInput[AttributeNames.NumericInputValue].value.toFixed(0)
        : numericInput[AttributeNames.NumericInputValue].value.toFixed(3)}
    </var>
  ) : (
    <var>
      <SymbolRenderer symbol={numericInput[AttributeNames.NumericScientificSymbol].value} />
      <SubscriptRenderer subscriptIndexes={numericInput.Subscript} />
    </var>
  );
};

const InputValueRenderer: React.FC<{ inputValue: InputValue; numericInputs: NumericInputs }> = ({ inputValue, numericInputs }) => {
  if (inputValue[AttributeNames.InputValue].s.value === 0)
    return numericInputs.v[inputValue[AttributeNames.InputValue].v[AttributeNames.InputReference].value] ? (
      <NumericInputRenderer numericInput={numericInputs.v[inputValue[AttributeNames.InputValue].v[AttributeNames.InputReference].value]} />
    ) : (
      <Tag color='red'>missing</Tag>
    );
  else
    return (
      <span style={sharedRowStyleWithBorder}>
        <InternalMethodRenderer floatMethod={inputValue[AttributeNames.InputValue] as FloatMethod} numericInputs={numericInputs} />
      </span>
    );
};

const FunctionArrayRenderer: React.FC<{
  functionArray: FunctionArrayEntries;
  numericInputs: NumericInputs;
  setMethodToEdit: (method: MethodEntry) => void;
}> = ({ functionArray, numericInputs, setMethodToEdit }) => {
  return (
    <div style={{ margin: 16, display: 'grid', gridTemplateColumns: 'auto auto 1fr auto auto', gap: 8, alignItems: 'center', maxWidth: 1000 }}>
      {Object.values(functionArray.v).map((method, index) => (
        <>
          <var>
            <SymbolRenderer symbol={method[AttributeNames.FunctionOutput][AttributeNames.NumericScientificSymbol].value} />
            <SubscriptRenderer subscriptIndexes={method[AttributeNames.FunctionOutput][AttributeNames.NumericScientificSubscript]} />
          </var>
          =
          <InputValueRenderer inputValue={method[AttributeNames.Function]} numericInputs={numericInputs} />
          <Button style={{ width: 150 }} onClick={() => setMethodToEdit(method as MethodEntry)}>
            <EditOutlined /> <MethodTitle method={method} />
          </Button>
          {functionArray.s.value > functionArray.s.min && index + 1 === functionArray.s.value ? (
            <DeleteFilled
              style={{ cursor: 'pointer', color: 'lightgray' }}
              onClick={() => useMethodData.getState().updateDataEntry({ ...functionArray.s, value: functionArray.s.value - 1 })}
            />
          ) : (
            <div />
          )}
        </>
      ))}
      {functionArray.s.value < functionArray.s.max ? (
        <div style={{ width: 25, height: 35, justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
          <PlusCircleFilled
            style={{ cursor: 'pointer' }}
            onClick={() => useMethodData.getState().updateDataEntry({ ...functionArray.s, value: functionArray.s.value + 1 })}
          />
        </div>
      ) : null}
    </div>
  );
};

export const MethodComposer: React.FC<{ setMethodToEdit: (method: MethodEntry) => void }> = ({ setMethodToEdit }) => {
  const data = useMethodData((s) => s.data) as VersionODataType;
  return (
    <FunctionArrayRenderer
      functionArray={data[AttributeNames.FunctionArray]}
      numericInputs={data[AttributeNames.NumericInputs]}
      setMethodToEdit={setMethodToEdit}
    />
  );
};
