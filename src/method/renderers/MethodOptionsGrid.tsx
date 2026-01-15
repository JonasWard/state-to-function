import React from 'react';
import { SymbolNameType } from '../specificInputs/NameEditor';
import { SymbolRenderer } from '../../Components/icon/SymbolRenderer';
import { EnumArrayNode, EnumNode } from 'url-safe-bitpacking';

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
  parentName: string;
  activeName: string;
  cellRenderer?: CellRendererType<SymbolNameType>;
}> = ({ values, select, parentName, activeName, cellRenderer = DefaultCellRenderer }) =>
  values.length > 0 ? (
    <>
      <span>{parentName}</span>
      <div className="symbol-editor">
        {values.map((sn, index) => cellRenderer(sn, index, activeName, parentName, select))}
      </div>
    </>
  ) : null;
