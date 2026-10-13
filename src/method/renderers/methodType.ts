import { EnumOptionsNode } from 'url-safe-bitpacking';
import { InputDefinitionTypes, AvailableMethodsTypes } from '../../legacy/oldModel';
import { TNodeUIProps } from '../../urlBitPacking/nodeProps';
import { SymbolNameType } from '../specificInputs/NameEditor';

export const TypeSymbol: Record<(typeof InputDefinitionTypes)[number], string> = {
  hardcoded: '𝑐',
  numericInput: 'ℝ',
  methodOutput: '𝑓()',
  method: '𝑓'
};

export type MethodHandlingProps = TNodeUIProps<EnumOptionsNode> & {
  availableNumericInputs: SymbolNameType[];
  availableMethodInputs: SymbolNameType[];
};

export const selectVariantData: 'filled' | 'outlined' | 'borderless' | 'underlined' = 'filled';

export const selectVariantMethod: 'filled' | 'outlined' | 'borderless' | 'underlined' = 'borderless';

export const ShortSymbol: Record<(typeof AvailableMethodsTypes)[number], string> = {
  addition: '+',
  multiplication: 'x',
  subtraction: '-',
  division: '÷',
  power: '^',
  smallerThan: '<',
  greaterThan: '>',
  equal: '='
};

export const JavascriptOperation: Record<(typeof AvailableMethodsTypes)[number], string> = {
  addition: '+',
  multiplication: '*',
  subtraction: '-',
  division: '/',
  power: '**',
  smallerThan: '<',
  greaterThan: '>',
  equal: '==='
};

export const getOperationForMethod = (node: EnumOptionsNode) => node.descriptor.mapping[node.state] as (typeof AvailableMethodsTypes)[number];
