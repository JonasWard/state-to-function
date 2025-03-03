import React from 'react';
import { DisplayType, StateDataRenderer } from './StateDataRenderer';
import { AttributeNames } from '../../modelDefinition/enums/attributeNames';
import { shouldUseDrawer } from '../utils/windowMethods';
import { EnumSemantics } from 'url-safe-bitpacking/dist/types';
import { useData } from '../../state/state';
import { DataType } from 'url-safe-bitpacking';

const displayTypeMap = {
  [AttributeNames.Version]: import.meta.env.DEV ? (shouldUseDrawer() ? DisplayType.DRAWER : DisplayType.POPOVER) : DisplayType.HIDDEN,
};

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
      displayTypeMap={displayTypeMap}
      type={DataType.VERSION}
    />
  );
};
