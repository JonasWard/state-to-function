import { DataEntry, DataEntryArray, EnumDataEntry, IntDataEntry } from 'url-safe-bitpacking/dist/types';
import { Button, Input, Popover } from 'antd';
import React, { ReactNode } from 'react';
import { DataEntryFactory, DataType } from 'url-safe-bitpacking';
import { getText } from '../lib/helpers';
import { AttributeNames } from '../modelDefinition/enums/attributeNames';
import { CheckCircleFilled, UndoOutlined } from '@ant-design/icons';

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
  placeholder?: string;
  sourceString: string;
  text: { s: IntDataEntry; v: { [AttributeNames.Character]: EnumDataEntry }[] };
  updateEntry: (dataEntry: DataEntry | DataEntryArray) => void;
}> = ({ text, updateEntry, sourceString, placeholder }) => {
  const [textArea, setTextArea] = React.useState(getText(text.v, sourceString));

  const handleChange = (e: { target: { value: string } }) => setTextArea(e.target.value);

  const updateValues = (s: string) => {
    // first entry to update
    const updateEntries: DataEntryArray = [{ ...text.s, type: DataType.INT, value: s.length }];

    for (let i = 0; i < s.length; i++) {
      const index = sourceString.indexOf(s[i]);
      const dataEntry = DataEntryFactory.createEnum(index > -1 ? index : 63, 63, AttributeNames.Character); // 0 = 63
      dataEntry.internalName = `${text.s.internalName!}_${i}_${AttributeNames.Character}`;
      updateEntries.push(dataEntry);
    }

    updateEntry(updateEntries);
  };

  const displayString = getDisplayString(textArea, sourceString);
  const hasChanges = textArea !== getText(text.v, sourceString);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '4px 0' }}>
      <Popover
        open={Boolean(displayString)}
        placement='bottom'
        style={{ background: '#ffcccc' }}
        content={
          <div style={{ width: 265, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span>{displayString}</span>
            <span>please stick to using these characters:</span>
            <span style={{ fontFamily: 'monospace, monospace' }}>{sourceString.slice(0, 32)}</span>
            <span style={{ fontFamily: 'monospace, monospace' }}>{sourceString.slice(32)}</span>
          </div>
        }
      >
        <span style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
          <Input placeholder={placeholder} key='text' value={textArea} onChange={handleChange} status={text.s.max === text.s.value ? 'warning' : undefined} />
          {hasChanges ? (
            <>
              <CheckCircleFilled
                disabled={Boolean(displayString)}
                style={displayString ? { cursor: 'not-allowed', color: 'lightgray' } : { cursor: 'pointer', color: 'black' }}
                onClick={() => updateValues(textArea)}
              />
              <UndoOutlined style={{ cursor: 'pointer' }} onClick={() => setTextArea(getText(text.v, sourceString))} />
            </>
          ) : null}
        </span>
      </Popover>
    </div>
  );
};
