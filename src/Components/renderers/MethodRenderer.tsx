import React from 'react';
import { useData } from '../../state/state';
import { getStateValue } from 'url-safe-bitpacking';
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
  TextArray,
  VersionOValueType,
} from '../../modelDefinition/types/version0.type';
import { AttributeNames } from '../../modelDefinition/enums/attributeNames';
import { validScientificSubscriptDescriptors, validScientificSymbols } from '../../modelDefinition/enums/chars';
import { Tag } from 'antd';

const SymbolRenderer: React.FC<{ symbol: number }> = ({ symbol }) => validScientificSymbols[symbol] ?? '🚽';

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

const SubscriptRenderer: React.FC<{ subscriptIndexes: TextArray }> = ({ subscriptIndexes }) => (
  <sub>
    {Object.values(subscriptIndexes.v)
      .map((i) => validScientificSubscriptDescriptors[i.c] ?? '💩')
      .join('')}
  </sub>
);

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
    <span>if (</span>
    <BooleanMethodRender booleanMethod={ifMethod.v.if.Mb} numericInputs={numericInputs} />
    <span>then:</span>
    <InputValueRenderer inputValue={ifMethod.v.if.a} numericInputs={numericInputs} />
    <span>else:</span>
    <InputValueRenderer inputValue={ifMethod.v.if.b} numericInputs={numericInputs} />
    <span>)</span>
  </span>
);

const NumericArrayRenderer: React.FC<{ arrayMethod: AddMethod | MultiplyMethod; numericInputs: NumericInputs }> = ({ arrayMethod, numericInputs }) => {
  const numericArray = Object.values(arrayMethod.v)[0];
  const operator = Object.keys(arrayMethod.v)[0];

  return (
    <span style={sharedRowStyle}>
      {numericArray[AttributeNames.NumericArray].v.map((v, i, arr) =>
        i !== arr.length - 1 ? (
          <>
            <InputValueRenderer inputValue={v} numericInputs={numericInputs} />
            {operator}
          </>
        ) : (
          <InputValueRenderer inputValue={v} numericInputs={numericInputs} />
        )
      )}
    </span>
  );
};

const InternalMethodRenderer: React.FC<{ floatMethod: FloatMethod; numericInputs: NumericInputs }> = ({ floatMethod, numericInputs }) => {
  switch (floatMethod.v.Mf.s) {
    case 0: // if method
      return <IfRenderer ifMethod={floatMethod.v.Mf} numericInputs={numericInputs} />;
    case 1: // multiply method
    case 2: // add method
      return <NumericArrayRenderer arrayMethod={floatMethod.v.Mf} numericInputs={numericInputs} />;
    case 3: // division method
      return divisionPairRenderer(floatMethod.v.Mf.v[AttributeNames.Division], numericInputs);
    case 4: // subtraction method
      return simplePairRenderer(floatMethod.v.Mf.v[AttributeNames.Subtraction], AttributeNames.Subtraction, numericInputs);
    case 5: // power method
      return powerPairRenderer(floatMethod.v.Mf.v[AttributeNames.Power], numericInputs);
  }
};

const NumericInputRenderer: React.FC<{ numericInput: NumericInput }> = ({ numericInput }) => {
  return (
    <var>
      <SymbolRenderer symbol={numericInput[AttributeNames.NumericScientificSymbol]} />
      <SubscriptRenderer subscriptIndexes={numericInput.Subscript} />
    </var>
  );
};

const InputValueRenderer: React.FC<{ inputValue: InputValue; numericInputs: NumericInputs }> = ({ inputValue, numericInputs }) => {
  if (inputValue[AttributeNames.InputValue].s === 0)
    return numericInputs.v[inputValue[AttributeNames.InputValue].v[AttributeNames.InputReference]] ? (
      <NumericInputRenderer numericInput={numericInputs.v[inputValue[AttributeNames.InputValue].v[AttributeNames.InputReference]]} />
    ) : (
      <Tag color='red'>missing</Tag>
    );
  else
    return (
      <span style={sharedRowStyleWithBorder}>
        <InternalMethodRenderer floatMethod={inputValue[AttributeNames.InputValue]} numericInputs={numericInputs} />
      </span>
    );
};

const Version0Renderer: React.FC<{ data: VersionOValueType }> = ({ data }) => {
  return (
    <span>
      <InputValueRenderer inputValue={data[AttributeNames.Function]} numericInputs={data[AttributeNames.NumericInputs]} />
    </span>
  );
};

export const MethodRenderer: React.FC = () => {
  const data = useData((s) => s.data);
  return <Version0Renderer data={getStateValue(data) as VersionOValueType} />;
};
