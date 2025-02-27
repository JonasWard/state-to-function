import { DataEntryFactory } from 'url-safe-bitpacking'
import { AttributeNames } from '../enums/attributeNames'
import {
  ArrayEntryDataType,
  EnumEntryDataType,
  NonEmptyValidEntryArrayType,
  OptionalEntryDataType,
  SingleLevelContentType,
} from 'url-safe-bitpacking/dist/types'
import { MainMethodLabels } from './methodSemantics'

const mainMethodVersionStack: ArrayEntryDataType = [
  [1, 3],
  [
    DataEntryFactory.createEnum(0, MainMethodLabels.length - 1, `${AttributeNames.MethodEnumMain}`),
    DataEntryFactory.createFloat(1, 0.001, 1000, 3, `${AttributeNames.MethodScale}`),
  ],
]

const viewportParameters: SingleLevelContentType[] = [
  [
    AttributeNames.OrbitControlTarget,
    [
      DataEntryFactory.createFloat(0, -1000, 1000, 0, AttributeNames.X),
      DataEntryFactory.createFloat(0, -1000, 1000, 0, AttributeNames.Y),
      DataEntryFactory.createFloat(0, -1000, 1000, 0, AttributeNames.Z),
      DataEntryFactory.createFloat(0, -1, 1, 3, AttributeNames.W),
    ],
  ],
  [
    AttributeNames.CameraPosition,
    [
      DataEntryFactory.createFloat(-128, -1000, 1000, 1, AttributeNames.X),
      DataEntryFactory.createFloat(192, -1000, 1000, 1, AttributeNames.Y),
      DataEntryFactory.createFloat(-152, -1000, 1000, 1, AttributeNames.Z),
    ],
  ],
  DataEntryFactory.createFloat(0, -180, 180, 1, AttributeNames.CameraAngle),
  DataEntryFactory.createFloat(0, -1000, 1000, 1, AttributeNames.Radius),
]

const normalsMaterial: OptionalEntryDataType = [
  false,
  [
    [
      'color',
      [
        DataEntryFactory.createInt(245, 0, 255, AttributeNames.R),
        DataEntryFactory.createInt(219, 0, 255, AttributeNames.G),
        DataEntryFactory.createInt(163, 0, 255, AttributeNames.B),
      ],
    ],
  ],
  [],
]

const materialDefinition: SingleLevelContentType[] = [[AttributeNames.NormalMaterial, normalsMaterial]]

const visualizationDefintion: SingleLevelContentType[] = [
  DataEntryFactory.createBoolean(false, AttributeNames.Wireframe),
  DataEntryFactory.createBoolean(true, AttributeNames.DoubleSided),
  DataEntryFactory.createBoolean(false, AttributeNames.Normals),
  DataEntryFactory.createBoolean(false, AttributeNames.Vertices),
]

const withBaseSwitch: OptionalEntryDataType = [
  true,
  [],
  [DataEntryFactory.createFloat(10, 0, 50, 1, 'h-base'), DataEntryFactory.createFloat(30, 25, 90, 0, 'baseAngle')],
]

const cube: NonEmptyValidEntryArrayType = [
  DataEntryFactory.createFloat(150, 40, 240, 1, 'h'),
  [AttributeNames.HasBase, withBaseSwitch],
  DataEntryFactory.createFloat(112, 30, 150, 1, 'w'),
  DataEntryFactory.createFloat(112, 30, 150, 1, 'd'),
  DataEntryFactory.createFloat(24, 10, 50, 1, 'max radius'),
  DataEntryFactory.createFloat(12, 0, 35, 1, 'edge radius'),
]

const cylinder: NonEmptyValidEntryArrayType = [
  DataEntryFactory.createFloat(100, 50, 240, 1, 'h'),
  DataEntryFactory.createFloat(1, 1, 10, 1, 'inset'),
  DataEntryFactory.createFloat(0, 0, 50, 1, 'h-base'),
  DataEntryFactory.createFloat(40, 10, 150, 1, 'r0'),
  DataEntryFactory.createFloat(40, 10, 150, 1, 'r1'),
  DataEntryFactory.createFloat(40, 10, 150, 1, 'r2'),
]

const floating: NonEmptyValidEntryArrayType = [
  DataEntryFactory.createFloat(1, 0, 1, 2, 'h'),
  DataEntryFactory.createFloat(1, 1, 10, 1, 'inset'),
  DataEntryFactory.createFloat(1, 1, 32, 1, 'h-base'),
  DataEntryFactory.createFloat(40, 30, 150, 1, 'w'),
  DataEntryFactory.createFloat(40, 30, 150, 1, 'd'),
]

const frauenKirche: NonEmptyValidEntryArrayType = [
  DataEntryFactory.createFloat(100, 50, 240, 1, 'h'),
  DataEntryFactory.createFloat(100, 0, 180, 1, 'h-base'),
  DataEntryFactory.createInt(4, 3, 10, 'sides'),
  DataEntryFactory.createFloat(0, -1, 1, 3, 'alcove-percentage'),
  DataEntryFactory.createFloat(0.0, 0.0, 2.0, 2, 'alcove-expression'),
  DataEntryFactory.createFloat(40, 30, 150, 1, 'w'),
]

const lampShades: EnumEntryDataType = [0, cube, cylinder, floating, frauenKirche]

const verticalProfileDefinition: NonEmptyValidEntryArrayType = [
  DataEntryFactory.createBoolean(false, 'reverse'),
  DataEntryFactory.createFloat(0, 0, 1, 2, 'edgeSmoothing'),
]

const globalGeometry: SingleLevelContentType[] = [
  DataEntryFactory.createInt(0, 0, 6, 'subDivisions'),
  DataEntryFactory.createFloat(0.5, 0, 1, 3, 'smoothing'),
  DataEntryFactory.createFloat(0.1, 0.01, 25, 2, 'expression'),
]

const hasverticalProfileDefinition: OptionalEntryDataType = [false, [], verticalProfileDefinition]

export const verionArrayDefinition0: SingleLevelContentType[] = [
  [AttributeNames.Viewport, viewportParameters],
  [AttributeNames.GlobalGeometry, globalGeometry],
  [AttributeNames.LampShades, lampShades],
  [AttributeNames.MainMethods, mainMethodVersionStack],
  [AttributeNames.VerticalProfile, hasverticalProfileDefinition],
  [AttributeNames.Material, materialDefinition],
  [AttributeNames.Visualization, visualizationDefintion],
]
