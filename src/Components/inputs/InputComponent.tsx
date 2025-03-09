import React, { useState } from 'react';
import { useData } from '../../state/state';
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
  VersionODataType,
  InputReference,
} from '../../modelDefinition/types/version0.data.type';
import { Button, Drawer, Popover, Select, Switch, Tag } from 'antd';
import { AttributeNames } from '../../modelDefinition/enums/attributeNames';
import { validScientificSymbols, validScientificSubscriptDescriptors, validDescriptors } from '../../modelDefinition/enums/chars';
import { EnumDataEntry } from 'url-safe-bitpacking/dist/types';
import { floatMethodLabels } from '../../modelDefinition/types/version0.enumsemantics';
import { TextInput } from '../TextInput';

const SymbolRenderer: React.FC<{ symbol: number }> = ({ symbol }) => validScientificSymbols[symbol] ?? '🚽';

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

const interMethodRow: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' };

const SubscriptRenderer: React.FC<{ subscriptIndexes: TextArray }> = ({ subscriptIndexes }) => (
  <sub>
    {Object.values(subscriptIndexes.v)
      .map((i) => validScientificSubscriptDescriptors[i.c.value] ?? '💩')
      .join('')}
  </sub>
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
  const comparator = Object.keys(booleanMethod.v)[0];

  return pairRenderer(numericPair, comparator, numericInputs, true);
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
          {i !== arr.length - 1 ? <span style={operatorStyling}>{operator}</span> : <div />}
          <InputValueRenderer inputValue={v} numericInputs={numericInputs} />
        </>
      ))}
    </span>
  );
};

const InternalMethodRenderer: React.FC<{ floatMethod: FloatMethod; numericInputs: NumericInputs }> = ({ floatMethod, numericInputs }) => {
  switch (floatMethod.v.Mf.s.value) {
    case 0: // if method
      return <IfRenderer ifMethod={floatMethod.v.Mf} numericInputs={numericInputs} />;
    case 1: // multiply method
    case 2: // add method
      return <NumericArrayRenderer arrayMethod={floatMethod.v.Mf} numericInputs={numericInputs} />;
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
    style={{ paddingLeft: 8 }}
    value={inputReference.v[AttributeNames.InputReference].value}
    onChange={(value) => useData.getState().updateDataEntry({ ...inputReference.v[AttributeNames.InputReference], value } as EnumDataEntry)}
  >
    {numericInputs.v.map((n, i) => (
      <Select.Option value={i}>
        <NumericInputRenderer numericInput={n} />
      </Select.Option>
    ))}
    {numericInputs.v.length - 1 < (inputReference.v[AttributeNames.InputReference] as EnumDataEntry).value ? (
      <Select.Option value={undefined}>
        <Tag color='red'>missing</Tag>
      </Select.Option>
    ) : null}
  </Select>
);

const FloatMethodSelector: React.FC<{ floatMethod: FloatMethod }> = ({ floatMethod }) => (
  <Select
    style={{ paddingLeft: 8 }}
    onChange={(value) => useData.getState().updateDataEntry({ ...floatMethod.v[AttributeNames.FloatMethod].s, value } as EnumDataEntry)}
    value={(floatMethod.v[AttributeNames.FloatMethod].s as EnumDataEntry).value}
  >
    {floatMethodLabels.map((label, value) => (
      <Select.Option value={value}>{label}</Select.Option>
    ))}
  </Select>
);

const InputValueRenderer: React.FC<{ inputValue: InputValue; numericInputs: NumericInputs }> = ({ inputValue, numericInputs }) =>
  inputValue[AttributeNames.InputValue].s.value === 0 ? (
    <div>
      <Switch
        checked={Boolean(inputValue[AttributeNames.InputValue].s.value)}
        unCheckedChildren={'n'}
        checkedChildren={'f'}
        onChange={(v) => useData.getState().updateDataEntry({ ...inputValue[AttributeNames.InputValue].s, value: v ? 1 : 0 } as EnumDataEntry)}
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
          onChange={(v) => useData.getState().updateDataEntry({ ...inputValue[AttributeNames.InputValue].s, value: v ? 1 : 0 } as EnumDataEntry)}
        />
        <FloatMethodSelector floatMethod={inputValue[AttributeNames.InputValue] as FloatMethod} />
      </span>
      <InternalMethodRenderer floatMethod={inputValue[AttributeNames.InputValue] as FloatMethod} numericInputs={numericInputs} />
    </div>
  );

const NumericInputEditor: React.FC<{ numericInput: NumericInput }> = ({ numericInput }) => {
  const [open, setOpen] = useState(false);

  const editSymbolContent = (
    <div style={{ display: 'grid', gridTemplateColumns: '30px 30px 30px 30px 30px 30px 30px 30px' }}>
      {validScientificSymbols.split('').map((s, i) => (
        <span
          style={{
            backgroundColor: i === numericInput[AttributeNames.NumericScientificSymbol].value ? '#ccccff' : '#eeeeff',
            margin: 2,
            padding: 'auto',
            textAlign: 'center',
            cursor: 'pointer',
            color: i === numericInput[AttributeNames.NumericScientificSymbol].value ? 'black' : 'gray',
            fontWeight: i === numericInput[AttributeNames.NumericScientificSymbol].value ? 'bold' : 400,
          }}
          onClick={() => {
            useData.getState().updateDataEntry({ ...numericInput[AttributeNames.NumericScientificSymbol], value: i });
            setOpen(false);
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '25px 1fr', gap: 6 }}>
      <div style={{ margin: 'auto', cursor: 'pointer' }}>
        <Popover open={open} content={editSymbolContent}>
          <var style={{ fontSize: 30, fontWeight: 'bold' }} onClick={() => setOpen(!open)}>
            {validScientificSymbols[numericInput[AttributeNames.NumericScientificSymbol].value]}
          </var>
        </Popover>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TextInput
          placeholder='Description of what I am'
          sourceString={validDescriptors}
          text={numericInput[AttributeNames.NumericInputName]}
          updateEntry={useData.getState().updateDataEntry}
        />
        <TextInput
          placeholder='subscript'
          sourceString={validScientificSubscriptDescriptors}
          text={numericInput[AttributeNames.NumericScientificSubscript]}
          updateEntry={useData.getState().updateDataEntry}
        />
      </div>
    </div>
  );
};

const NumericInputsEditor: React.FC<{ numericInputs: NumericInputs }> = ({ numericInputs }) => (
  <>
    {numericInputs.v.map((input) => (
      <NumericInputEditor numericInput={input} />
    ))}
  </>
);

const Version0Renderer: React.FC<{ data: VersionODataType }> = ({ data }) => {
  return (
    <>
      <InputValueRenderer inputValue={data[AttributeNames.Function]} numericInputs={data[AttributeNames.NumericInputs]} />
      <NumericInputsEditor numericInputs={data[AttributeNames.NumericInputs]} />
    </>
  );
};

export const InputComponent: React.FC = () => {
  const data = useData((s) => s.data);
  const [open, setOpen] = useState(true);

  return (
    <>
      <Button style={{ position: 'absolute', bottom: 10, right: 10 }} onClick={() => setOpen(true)}>
        view wip editor
      </Button>
      <Drawer mask={false} open={open} placement='right' onClose={() => setOpen(false)}>
        <Version0Renderer data={data as unknown as VersionODataType} />
      </Drawer>
    </>
  );
};
