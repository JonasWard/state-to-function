import { EnumDataEntry, IntDataEntry } from 'url-safe-bitpacking/dist/types';
import { Button, Input } from 'antd';
import React, { ReactNode } from 'react';
import { DataEntryFactory, DataType } from 'url-safe-bitpacking';
import { getText } from '../lib/helpers';
import { AttributeNames } from '../modelDefinition/enums/attributeNames';

const getDisplayString = (s: string, sourceString: string): null | ReactNode => {
  const chars: ReactNode[] = [];
  let difCount = 0;
  for (let i = 0; i < s.length; i++) {
    const index = sourceString.indexOf(s[i]);
    const c = s[i];
    if (index === -1) {
      difCount += 1;
      chars.push(<span style={{ color: 'white', backgroundColor: 'red' }}>{c}</span>);
    } else if (i > 255) {
      difCount += 1;
      chars.push(<span style={{ color: 'white', backgroundColor: 'black' }}>{c}</span>);
    } else chars.push(c);
  }

  return difCount > 0 ? (
    <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column' }}>
      <span style={{ color: 'white', backgroundColor: 'green' }}>{difCount} characters are not supported</span>
      <span>{chars}</span>
    </div>
  ) : null;
};

export const TextInput: React.FC<{
  sourceString: string;
  text: { s: IntDataEntry; v: { [AttributeNames.Character]: EnumDataEntry }[] };
  updateEntry: (dataEntry: EnumDataEntry | EnumDataEntry[]) => void;
}> = ({ text, updateEntry, sourceString }) => {
  const [textArea, setTextArea] = React.useState(getText(text.v, sourceString));

  const handleChange = (e: { target: { value: string } }) => setTextArea(e.target.value);

  const updateValues = (s: string) => {
    const internalNameTemplateA = `_${text.s.name}_${text.s.name}_${text.s.name}_`;
    const internalNameTemplateB = `_${text.s.name}`;

    // first entry to update
    const updateEntries: EnumDataEntry[] = [{ ...text.s, type: DataType.ENUM, value: s.length }];

    for (let i = 0; i < s.length; i++) {
      const index = sourceString.indexOf(s[i]);
      const dataEntry = DataEntryFactory.createEnum(index > -1 ? index : 63, 63, AttributeNames.Character); // 0 = 63
      dataEntry.internalName = `${internalNameTemplateA}${i}${internalNameTemplateB}`;
      updateEntries.push(dataEntry);
    }

    updateEntry(updateEntries);
  };

  return (
    <>
      <Input key='text' value={textArea} onChange={handleChange} status={text.s.max === text.s.value ? 'warning' : undefined} />
      {getDisplayString(textArea, sourceString)}
      <div style={{ marginTop: 4 }}>
        <Button type='primary' onClick={() => updateValues(textArea)}>
          Apply
        </Button>
        <Button style={{ marginLeft: 4 }} onClick={() => setTextArea(getText(text.v, sourceString))}>
          Reset
        </Button>
      </div>
    </>
  );
};
