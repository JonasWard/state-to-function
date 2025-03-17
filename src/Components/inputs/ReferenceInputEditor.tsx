import { Popover } from 'antd';
import { useState } from 'react';
import { AttributeNames } from '../../modelDefinition/enums/attributeNames';
import { validScientificSymbols, validDescriptors, validScientificSubscriptDescriptors } from '../../modelDefinition/enums/chars';
import { NumericInput, MethodEntry } from '../../modelDefinition/types/version0.data.type';
import { useMethodData } from '../../state/method';
import { BooleanDataEntryRenderer } from '../parametrics/dataentryrenderers/BooleanDataEntryRenderer';
import { FloatDataEntryRenderer } from '../parametrics/dataentryrenderers/FloatDataEntryRenderer';
import { TextInput } from '../TextInput';
import React from 'react';

export const MethodOutputEditor: React.FC<{ methodName: MethodEntry[AttributeNames.FunctionOutput] }> = ({ methodName }) => {
  const [open, setOpen] = useState(false);

  const editSymbolContent = (
    <div style={{ display: 'grid', gridTemplateColumns: '30px 30px 30px 30px 30px 30px 30px 30px' }}>
      {validScientificSymbols.split('').map((s, i) => (
        <span
          style={{
            backgroundColor: i === methodName[AttributeNames.NumericScientificSymbol].value ? '#ccccff' : '#eeeeff',
            margin: 2,
            padding: 'auto',
            textAlign: 'center',
            cursor: 'pointer',
            color: i === methodName[AttributeNames.NumericScientificSymbol].value ? 'black' : 'gray',
            fontWeight: i === methodName[AttributeNames.NumericScientificSymbol].value ? 'bold' : 400,
          }}
          onClick={() => {
            useMethodData.getState().updateDataEntry({ ...methodName[AttributeNames.NumericScientificSymbol], value: i });
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
            {validScientificSymbols[methodName[AttributeNames.NumericScientificSymbol].value]}
          </var>
        </Popover>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TextInput
          key={methodName[AttributeNames.NumericInputName].s.internalName}
          placeholder='Description of what I am'
          sourceString={validDescriptors}
          text={methodName[AttributeNames.NumericInputName]}
          updateEntry={useMethodData.getState().updateDataEntry}
        />
        <TextInput
          key={methodName[AttributeNames.NumericScientificSubscript].s.internalName}
          placeholder='subscript'
          sourceString={validScientificSubscriptDescriptors}
          text={methodName[AttributeNames.NumericScientificSubscript]}
          updateEntry={useMethodData.getState().updateDataEntry}
        />
      </div>
    </div>
  );
};

export const ReferenceInputEditor: React.FC<{ numericInput: NumericInput }> = ({ numericInput }) => {
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
            useMethodData.getState().updateDataEntry({ ...numericInput[AttributeNames.NumericScientificSymbol], value: i });
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
          updateEntry={useMethodData.getState().updateDataEntry}
        />
        <TextInput
          placeholder='subscript'
          sourceString={validScientificSubscriptDescriptors}
          text={numericInput[AttributeNames.NumericScientificSubscript]}
          updateEntry={useMethodData.getState().updateDataEntry}
        />
        <span style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
          <BooleanDataEntryRenderer bool={numericInput[AttributeNames.Hardcoded]} onChange={(b) => useMethodData.getState().updateDataEntry(b)} />
          <FloatDataEntryRenderer float={numericInput[AttributeNames.NumericInputValue]} onChange={(f) => useMethodData.getState().updateDataEntry(f)} />
        </span>
      </div>
    </div>
  );
};
