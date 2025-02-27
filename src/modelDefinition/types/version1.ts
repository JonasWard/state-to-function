import {
  DataEntryFactory,
  EnumEntryDataType,
  NonEmptyValidEntryArrayType,
  SingleLevelContentType,
} from 'url-safe-bitpacking'
import { verionArrayDefinition0 } from './version0'
import { AttributeNames } from '../enums/attributeNames'

const baseColor: SingleLevelContentType = [
  'baseColor',
  [
    DataEntryFactory.createInt(63, 0, 255, AttributeNames.R),
    DataEntryFactory.createInt(60, 0, 255, AttributeNames.G),
    DataEntryFactory.createInt(55, 0, 255, AttributeNames.B),
  ],
]

const simpleCube: NonEmptyValidEntryArrayType = [
  DataEntryFactory.createFloat(25, 10, 100, 1, 'h'),
  DataEntryFactory.createFloat(15, 2, 100, 1, 'edgeThickness'),
  DataEntryFactory.createFloat(0, -1, 1, 2, 'tolerance'),
  DataEntryFactory.createFloat(5, 2, 10, 1, 'socketRadius'),
  baseColor,
]

const continiousCube: NonEmptyValidEntryArrayType = [
  DataEntryFactory.createFloat(25, 10, 100, 1, 'h'),
  DataEntryFactory.createFloat(15, 2, 100, 1, 'edgeThickness'),
  DataEntryFactory.createFloat(0, -1, 1, 2, 'tolerance'),
  DataEntryFactory.createFloat(5, 2, 10, 1, 'socketRadius'),
  baseColor,
]

const externalCube: NonEmptyValidEntryArrayType = [
  DataEntryFactory.createFloat(25, 10, 100, 1, 'h'),
  DataEntryFactory.createFloat(25, 10, 100, 1, 'hInternal'),
  DataEntryFactory.createFloat(15, 2, 100, 1, 'extraEdge'),
  DataEntryFactory.createFloat(0, -1, 1, 2, 'tolerance'),
  DataEntryFactory.createFloat(5, 2, 10, 1, 'internalRadius'),
  baseColor,
]

const base: EnumEntryDataType = [0, simpleCube, continiousCube, externalCube]

export const verionArrayDefinition1: SingleLevelContentType[] = [...verionArrayDefinition0, [AttributeNames.Base, base]]
