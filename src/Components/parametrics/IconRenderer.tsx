import React from 'react';
import { DataType } from 'url-safe-bitpacking';

export interface IconRendererProps {
  name: string;
  type?: DataType;
  size?: number;
}

// eslint-disable-next-line react-refresh/only-export-components
export const getIconForKey = (name: string, type?: DataType) => {
  switch (type) {
    case DataType.INT:
      return { mainIcon: 'i', subscript: name };
    case DataType.FLOAT:
      return { mainIcon: 'f', subscript: name };
    case DataType.BOOLEAN:
      return { mainIcon: 'b', subscript: name };
    case DataType.VERSION:
      return { mainIcon: 'v', subscript: name };
    case DataType.ENUM:
      return { mainIcon: 'e', subscript: name };
    default:
      return { mainIcon: name };
  }
};

export const IconRenderer: React.FC<IconRendererProps> = ({ name, type, size = 20 }) => {
  const { mainIcon, subscript } = getIconForKey(name, type);
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: size * 1.3 }}>
      <div style={{ fontSize: size, alignItems: 'center' }}>{mainIcon}</div>
      {subscript ? (
        <div
          style={{
            fontSize: size * 0.5,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {subscript ? <div key='subscript'>{subscript}</div> : <div style={{ height: '50%' }} />}
        </div>
      ) : (
        <span style={{ marginLeft: 10 }}>{name}</span>
      )}
    </div>
  );
};
