import React from 'react';
import { SymbolNameType } from '../specificInputs/NameEditor';
import { SymbolRenderer } from '../../Components/icon/SymbolRenderer';
import { EnumArrayNode, EnumNode } from 'url-safe-bitpacking';
import { IconTitle } from '../../Components/icon/IconTitle';
import { NumberOutlined, FunctionOutlined } from '@ant-design/icons';
import { InputDefinitionTypes } from '../../modelDefinition/newModel';

const nameKeyMapIcon: Record<(typeof InputDefinitionTypes)[number], React.ReactNode> = {
  numericInput: <NumberOutlined />,
  methodOutput: '=',
  hardcoded: '𝑐',
  method: <FunctionOutlined />
};

const nameKeyMap: Record<(typeof InputDefinitionTypes)[number], string> = {
  numericInput: 'Inputs',
  methodOutput: 'Method Outputs',
  hardcoded: 'Hardcoded',
  method: 'Method Operation'
};

const Cell: React.FC<{ value: String | SymbolNameType; name: string; activeName: string; onClick: () => void }> = ({
  value,
  name,
  activeName,
  onClick
}) => (
  <span
    onClick={(e) => (onClick(), e.stopPropagation())}
    className={activeName === name ? 'symbol-boxes selected' : 'symbol-boxes'}
  >
    {typeof value === 'string' ? (
      value
    ) : (
      <SymbolRenderer {...{ symbol: value[0] as EnumNode, subscript: value[1] as EnumArrayNode, size: '.8rem' }} />
    )}
  </span>
);

type CellRendererType<T extends string | SymbolNameType> = (
  value: T,
  index: number,
  activeName: string,
  parentName: string,
  select: (i: number) => void
) => React.ReactNode;

const DefaultCellRenderer: CellRendererType<SymbolNameType> = (value, index, activeName, parentName, select) => (
  <Cell value={value} name={`${parentName}[${index}]`} activeName={activeName} onClick={() => select(index)} />
);

export const MethodOptionsGrid: React.FC<{
  values: string[] | SymbolNameType[];
  select: (i: number) => void;
  parentName: (typeof InputDefinitionTypes)[number];
  activeName: string;
  cellRenderer?: CellRendererType<SymbolNameType>;
}> = ({ values, select, parentName, activeName, cellRenderer = DefaultCellRenderer }) =>
  values.length > 0 ? (
    <>
      <IconTitle
        icon={nameKeyMapIcon[parentName as (typeof InputDefinitionTypes)[number]]}
        title={nameKeyMap[parentName as (typeof InputDefinitionTypes)[number]]}
        size="small"
      />
      <div className="symbol-editor">
        {values.map((sn, index) =>
          cellRenderer(sn, index, activeName, parentName === 'method' ? '' : parentName, select)
        )}
      </div>
    </>
  ) : null;
