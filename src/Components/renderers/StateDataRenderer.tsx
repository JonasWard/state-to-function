import React from 'react';
import { useData } from '../../state/state';
import { DataEntry, DerivativeStateDataType, StateDataType } from 'url-safe-bitpacking';
import { MethodRenderer } from './MethodRenderer';

const isDataEntry = (data: StateDataType | DataEntry | DerivativeStateDataType) =>
  Object.hasOwn(data as DataEntry, 'type') && Object.hasOwn(data as DataEntry, 'value');

const GeneralObjectRenderer: React.FC<{ data: StateDataType | DataEntry | DerivativeStateDataType }> = ({ data }) => {
  if (isDataEntry(data)) return `${(data as DataEntry).type} ${(data as DataEntry).name}`;
  else if (Object.hasOwn(data as DerivativeStateDataType, 'v') && Object.hasOwn(data as DerivativeStateDataType, 's'))
    return (
      <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 8 }}>
        <span>
          <GeneralObjectRenderer data={(data as DerivativeStateDataType).s} />
        </span>
        {Array.isArray((data as DerivativeStateDataType).v) ? (
          ((data as DerivativeStateDataType).v as StateDataType[]).map((nestedData) => <GeneralObjectRenderer data={nestedData} />)
        ) : (
          <GeneralObjectRenderer data={(data as DerivativeStateDataType).v as StateDataType} />
        )}
      </div>
    );
  else
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(data as StateDataType).map(([aName, nestedData]) => (
          <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 8 }}>
            <span>{aName}</span>
            <GeneralObjectRenderer data={nestedData} />
          </div>
        ))}
      </div>
    );
};

export const StateDataRenderer: React.FC = () => {
  const data = useData((s) => s.data);

  // return JSON.stringify(getStateValue(data), null, '\t');
  return <MethodRenderer />;
  return <GeneralObjectRenderer data={data} />;
};
