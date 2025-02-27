import { AttributeNames } from '../enums/attributeNames'
import { ExtrusionCategory } from './extrusion'
import { FootprintCategory } from './footprint'
import { ProcessingMethodCategory } from './heights'
import { MainMethodLabels, PreProcessingMethodLabels } from './methodSemantics'
import { Versions } from './versions'

const processingMethodTypes = [
  { value: ProcessingMethodCategory.None, label: 'None Method' },
  { value: ProcessingMethodCategory.IncrementalMethod, label: 'Incremental Method' },
  { value: ProcessingMethodCategory.Sin, label: 'Sin Method' },
]

export const version0EnumSemantics = {
  [AttributeNames.Version]: Versions,
  [AttributeNames.MethodEnumMain]: MainMethodLabels,
  [AttributeNames.MethodEnumPre]: PreProcessingMethodLabels,
  [AttributeNames.Extrusion]: [
    { value: ExtrusionCategory.Square, label: 'Square Extrusion' },
    { value: ExtrusionCategory.Arc, label: 'Arc Extrusion' },
    { value: ExtrusionCategory.Ellipse, label: 'Ellipse Extrusion' },
    { value: ExtrusionCategory.Gothic, label: 'Gothic Arc Extrusion' },
    { value: ExtrusionCategory.Nested, label: 'Nested Arc Extrusion' },
  ],
  [AttributeNames.Footprint]: [
    { value: FootprintCategory.Square, label: 'Square Footprint' },
    { value: FootprintCategory.SquareGrid, label: 'Square Grid Footprint' },
    { value: FootprintCategory.TriangleGrid, label: 'Triangle Grid Footprint' },
    { value: FootprintCategory.HexGrid, label: 'Hex Grid Footprint' },
    { value: FootprintCategory.Cylinder, label: 'Cylinder Footprint' },
    { value: FootprintCategory.MalculmiusOne, label: 'Malculmius One Footprint' },
  ],
  [AttributeNames.HeightsProcessingMethod]: processingMethodTypes,
  [AttributeNames.PostProcessingMethods]: processingMethodTypes,
  [AttributeNames.ShellThickness]: [
    { value: 0, label: 'Massive' },
    { value: 1, label: '1 Layer' },
    { value: 2, label: '2 Layers' },
    { value: 3, label: '3 Layers' },
  ],
  [AttributeNames.LampShades]: [
    { value: 0, label: 'Cube' },
    { value: 1, label: 'Cylinder' },
    { value: 2, label: 'Hanging' },
    { value: 3, label: 'Church' },
  ],
  [AttributeNames.Base]: [
    { value: 0, label: 'Cube' },
    { value: 1, label: AttributeNames.Extrusion },
    { value: 2, label: 'Plate' },
  ],
}
