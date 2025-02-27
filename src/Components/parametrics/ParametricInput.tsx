import React from 'react'
import { DisplayType, StateDataRenderer } from './StateDataRenderer'
import { AttributeNames } from '../../modelDefinition/enums/attributeNames'
import { shouldUseDrawer } from '../utils/windowMethods'
import { EnumSemantics } from 'url-safe-bitpacking/dist/types'
import { useData } from '../../state/state'

const displayTypeMap = {
  [AttributeNames.Version]: import.meta.env.DEV
    ? shouldUseDrawer()
      ? DisplayType.DRAWER
      : DisplayType.POPOVER
    : DisplayType.HIDDEN,
  [AttributeNames.Viewport]: import.meta.env.DEV
    ? shouldUseDrawer()
      ? DisplayType.DRAWER
      : DisplayType.POPOVER
    : DisplayType.HIDDEN,
  [AttributeNames.LampShades]: shouldUseDrawer() ? DisplayType.DRAWER : DisplayType.POPOVER,
  [AttributeNames.MainMethods]: shouldUseDrawer() ? DisplayType.DRAWER : DisplayType.POPOVER,
  [AttributeNames.Footprint]: shouldUseDrawer() ? DisplayType.DRAWER : DisplayType.POPOVER,
  [AttributeNames.Heights]: shouldUseDrawer() ? DisplayType.DRAWER : DisplayType.POPOVER,
  [AttributeNames.Base]: shouldUseDrawer() ? DisplayType.DRAWER : DisplayType.POPOVER,
  [AttributeNames.Material]: shouldUseDrawer() ? DisplayType.DRAWER : DisplayType.POPOVER,
  [AttributeNames.VerticalProfile]: shouldUseDrawer() ? DisplayType.DRAWER : DisplayType.POPOVER,
  [AttributeNames.Visualization]: shouldUseDrawer() ? DisplayType.DRAWER : DisplayType.POPOVER,
  [AttributeNames.GlobalGeometry]: shouldUseDrawer() ? DisplayType.DRAWER : DisplayType.POPOVER,
}

type IParametricInputProps = {
  versionEnumSemantics?: EnumSemantics
}

export const ParametricInput: React.FC<IParametricInputProps> = ({ versionEnumSemantics }) => {
  const data = useData((s) => s.data)
  const updateEntry = useData((s) => s.updateDataEntry)
  const [activeName, setActiveName] = React.useState('')

  return (
    <div style={{ position: 'fixed', left: 10, top: 10, padding: 8 }}>
      <StateDataRenderer
        asSlider
        data={data}
        name={''} // name is not used in this context
        updateEntry={updateEntry}
        versionEnumSemantics={versionEnumSemantics}
        activeName={activeName}
        setActiveName={setActiveName}
        displayTypeMap={displayTypeMap}
      />
    </div>
  )
}
