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
import { AttributeNames } from '../../modelDefinition/enums/attributeNames';
import { EnumDataEntry } from 'url-safe-bitpacking/dist/types';
import { booleanMethodLabels, floatMethodLabels } from '../../modelDefinition/types/version0.enumsemantics';
import { DeleteFilled, PlusCircleFilled } from '@ant-design/icons';
import { MethodOutputEditor } from './ReferenceInputEditor';
import { Select, Tag, Switch } from 'antd';
import { SymbolRenderer } from './SymbolRenderer';
import { SubscriptRenderer } from './SubscriptRenderer';

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

const FloatMethodSelector: React.FC<{ floatMethod: FloatMethod }> = ({ floatMethod }) => (
  <Select
    variant='filled'
    style={{ paddingLeft: 8 }}
    onChange={(value) => useMethodData.getState().updateDataEntry({ ...floatMethod.v[AttributeNames.FloatMethod].s, value })}
    value={floatMethod.v[AttributeNames.FloatMethod].s.value}
  >
    {floatMethodLabels.map((label, value) => (
      <Select.Option key={label} value={value}>
        {label}
      </Select.Option>
    ))}
  </Select>
);

const BooleanMethodSelect: React.FC<{ booleanMethod: BooleanMethod }> = ({ booleanMethod }) => (
  <Select
    variant='filled'
    style={{ paddingLeft: 8 }}
    onChange={(value) => useMethodData.getState().updateDataEntry({ ...booleanMethod.s, value })}
    value={booleanMethod.s.value}
  >
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

// const FunctionArrayRenderer: React.FC<{ functionArray: FunctionArrayEntries; numericInputs: NumericInputs }> = ({ functionArray, numericInputs }) => {
//   return Object.values(functionArray.v).map((input) => );
// };

// const Version0Renderer: React.FC<{ data: VersionODataType }> = ({ data }) => {
//   return (
//     <>
//       <FunctionArrayRenderer functionArray={data[AttributeNames.FunctionArray]} numericInputs={data[AttributeNames.NumericInputs]} />
//       <NumericInputsEditor numericInputs={data[AttributeNames.NumericInputs]} />
//     </>
//   );
// };

// export const InputComponent: React.FC = () => {
//   const data = useData((s) => s.data);
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       <Button style={{ position: 'absolute', bottom: 10, right: 10 }} onClick={() => setOpen(true)}>
//         view wip editor
//       </Button>
//       <Drawer mask={false} open={open} placement='right' onClose={() => setOpen(false)}>
//         <Version0Renderer data={data as unknown as VersionODataType} />
//       </Drawer>
//     </>
//   );
// };
