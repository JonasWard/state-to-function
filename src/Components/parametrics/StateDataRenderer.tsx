import React from 'react';
import { ViewWrapper } from './ViewWrapper';
import { DataEntry, DataType, EnumSemantics, StateDataType } from 'url-safe-bitpacking';
import { DataEntryRenderer } from './dataentryrenderers/DataEntryRenderer';
import { DerivativeStateDataRenderer } from './DerivativeStateDataRenderer';
import { DerivativeStateDataType } from 'url-safe-bitpacking/dist/types';

export enum DisplayType {
  NESTED,
  POPOVER,
  HIDDEN,
}

export const getDisplayType = (key: string, displayTypeMap?: { [key: string]: DisplayType }) => {
  if (displayTypeMap?.hasOwnProperty(key)) return displayTypeMap[key];
  return DisplayType.NESTED;
};

export type ISemtanticsRenderObjectProps = {
  data: StateDataType;
  name: string;
  type: DataType;
  updateEntry: (dataEntry: DataEntry | DataEntry[]) => void;
  versionEnumSemantics?: EnumSemantics;
  displayTypeMap?: { [key: string]: DisplayType };
  displayType?: DisplayType;
  activeName: string;
  setActiveName: (name: string) => void;
  asSlider?: boolean;
  disabled?: string[];
};

export const StateDataRenderer: React.FC<ISemtanticsRenderObjectProps> = ({
  data,
  name,
  type,
  updateEntry,
  versionEnumSemantics,
  displayTypeMap,
  activeName,
  setActiveName,
  asSlider,
  disabled = [],
}) => {
  return (
    <ViewWrapper
      key={name}
      disabled={disabled}
      displayType={getDisplayType(name, displayTypeMap)}
      name={name}
      type={type}
      activeName={activeName}
      setActiveName={setActiveName}
    >
      {Object.entries(data).map(([semantic, value]) => {
        if (value.hasOwnProperty('type'))
          return (
            <ViewWrapper
              key={semantic}
              displayType={getDisplayType((value as DataEntry).internalName!, displayTypeMap)}
              name={(value as DataEntry).internalName!}
              type={(value as DataEntry).type!}
              activeName={activeName}
              setActiveName={setActiveName}
              disabled={disabled}
            >
              <DataEntryRenderer
                asSlider={asSlider}
                key={semantic}
                dataEntry={value as DataEntry}
                updateEntry={updateEntry}
                versionEnumSemantics={versionEnumSemantics}
                hidden={getDisplayType(semantic, displayTypeMap) === DisplayType.HIDDEN}
              />
            </ViewWrapper>
          );
        if (value.hasOwnProperty('s') && value.hasOwnProperty('v'))
          return (
            <div style={{ paddingLeft: 10, borderLeft: '1px solid black' }}>
              <DerivativeStateDataRenderer
                asSlider={asSlider}
                key={`${semantic}-subdata`}
                name={semantic}
                s={(value as DerivativeStateDataType).s}
                v={(value as DerivativeStateDataType).v}
                versionEnumSemantics={versionEnumSemantics}
                updateEntry={updateEntry}
                displayType={getDisplayType(semantic, displayTypeMap)}
                displayTypeMap={displayTypeMap}
                activeName={activeName}
                setActiveName={setActiveName}
                disabled={disabled}
              />
            </div>
          );

        return (
          <StateDataRenderer
            asSlider={asSlider}
            key={`${semantic}-subdata`}
            name={semantic}
            data={value as StateDataType}
            versionEnumSemantics={versionEnumSemantics}
            updateEntry={updateEntry}
            displayType={getDisplayType(semantic, displayTypeMap)}
            displayTypeMap={displayTypeMap}
            activeName={activeName}
            setActiveName={setActiveName}
            disabled={disabled}
            type={DataType.VERSION}
          />
        );
      })}
    </ViewWrapper>
  );
};
