import { Popover } from 'antd';
import { TSymbolProps, SymbolRenderer } from '../renderers/icon/SymbolRenderer';
import React from 'react';

export const SymbolInputs: React.FC<
  TSymbolProps & {
    forceRender: () => void;
  }
> = ({ forceRender, ...props }) => (
  <Popover
    trigger="click"
    content={
      <div className="symbol-editor">
        {(props.symbol.descriptor.mapping as string[]).map((s, i) => (
          <span
            className={i === props.symbol.value ? 'symbol-boxes selected' : 'symbol-boxes'}
            onClick={() => (props.symbol.updateValue(i), forceRender())}
            key={i}
            children={s}
          />
        ))}
      </div>
    }
  >
    <span style={{ cursor: 'pointer', padding: 4 }}>
      <SymbolRenderer {...props} />
    </span>
  </Popover>
);
