import { Input, Popover } from 'antd';
import React, { ReactNode, useEffect } from 'react';
import { getIndexesFromText, getMappingString } from './lib/textHelpers';
import { getText } from './lib/textHelpers';
import { CheckCircleFilled, UndoOutlined } from '@ant-design/icons';
import { EnumArrayNode } from 'url-safe-bitpacking';
import { useGlobalUIStore } from '../state/globalUIStore';

const GAP_SIZE = 4;

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
      <span style={{ color: 'white', backgroundColor: 'green' }}>
        {difCount === 1 ? 'one unsupported character' : difCount + ' characters are not supported'}
      </span>
      <span>{chars}</span>
    </div>
  ) : null;
};

export const TextInput: React.FC<{
  placeholder?: string;
  textEntry: EnumArrayNode;
  size?: 'small' | 'middle' | 'large';
  styleOverwrite?: { minWidth?: number; maxWidth?: number };
  forceRender: () => void;
  customValidation?: (s: string) => string | null;
}> = ({ textEntry, placeholder, forceRender, customValidation, size }) => {
  const { isDesktop } = useGlobalUIStore();

  const [textArea, setTextArea] = React.useState(getText(textEntry));

  const sourceString = getMappingString(textEntry);

  const handleChange = (e: { target: { value: string } }) => setTextArea(e.target.value);

  const updateValues = (s: string) => {
    const indexes = getIndexesFromText(s, textEntry);
    textEntry.updateValue(indexes);
    forceRender();
  };

  useEffect(() => {
    setTextArea(getText(textEntry));
  }, [textEntry]);

  const displayString = getDisplayString(textArea, sourceString);
  const customValidationString = customValidation ? customValidation(textArea) : null;
  const hasChanges = textArea !== getText(textEntry);
  const isValid = !(Boolean(displayString) || Boolean(customValidationString));

  return (
    <Popover
      open={!isValid}
      placement="bottom"
      style={{ background: '#ffcccc' }}
      content={
        customValidationString ? (
          <div style={{ width: 265, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span>{customValidationString}</span>
          </div>
        ) : (
          <div style={{ width: 265, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span>{displayString}</span>
            <span>please stick to using these characters:</span>
            <span style={{ fontFamily: 'monospace, monospace' }}>{sourceString.slice(0, 32)}</span>
            <span style={{ fontFamily: 'monospace, monospace' }}>{sourceString.slice(32)}</span>
          </div>
        )
      }
    >
      <span style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: GAP_SIZE, width: '100%' }}>
        <Input
          size={size ?? isDesktop ? 'middle' : 'small'}
          placeholder={placeholder}
          key={(textEntry as any).bitstring}
          value={textArea}
          onChange={handleChange}
          status={!isValid ? 'error' : textEntry.descriptor.maxCount === textEntry.value.length ? 'warning' : undefined}
          style={{
            width: `calc(100% + ${hasChanges ? 0 : GAP_SIZE}px)`
          }}
        />
        <span
          style={{
            display: 'flex',
            flexDirection: 'row',
            transition: 'all .5s',
            width: hasChanges ? 36 : 0,
            marginLeft: hasChanges ? 0 : -GAP_SIZE,
            gap: GAP_SIZE
          }}
        >
          {hasChanges ? (
            <span style={{ display: 'flex', flexDirection: 'row', gap: GAP_SIZE }}>
              <CheckCircleFilled
                disabled={Boolean(displayString)}
                style={
                  displayString ? { cursor: 'not-allowed', color: 'lightgray' } : { cursor: 'pointer', color: 'black' }
                }
                onClick={() => updateValues(textArea)}
              />
              <UndoOutlined size={12} style={{ cursor: 'pointer' }} onClick={() => setTextArea(getText(textEntry))} />
            </span>
          ) : (
            <span />
          )}
        </span>
      </span>
    </Popover>
  );
};
