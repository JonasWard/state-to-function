import React from 'react';
import { StateDataRenderer } from './StateDataRenderer';
import { EnumSemantics } from 'url-safe-bitpacking/dist/types';
import { useData } from '../../state/state';
import { DataType } from 'url-safe-bitpacking';

type IParametricInputProps = {
  versionEnumSemantics?: EnumSemantics;
};

export const ParametricInput: React.FC<IParametricInputProps> = ({ versionEnumSemantics }) => {
  const data = useData((s) => s.data);
  const updateEntry = useData((s) => s.updateDataEntry);
  const [activeName, setActiveName] = React.useState('');

  return (
    <StateDataRenderer
      asSlider
      data={data}
      name={''} // name is not used in this context
      updateEntry={updateEntry}
      versionEnumSemantics={versionEnumSemantics}
      activeName={activeName}
      setActiveName={setActiveName}
      type={DataType.VERSION}
    />
  );
};
