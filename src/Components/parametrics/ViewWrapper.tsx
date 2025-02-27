import React, { ReactNode } from 'react';
import { PopoverWrapper } from './PopoverWrapper';
import { IconRenderer } from './IconRenderer';
import { DisplayType } from './StateDataRenderer';
import { DrawerWrapper } from './DrawerWrapper';
import { DataType } from 'url-safe-bitpacking';

interface IViewWrapperProps {
  children: ReactNode;
  displayType: DisplayType;
  type: DataType;
  name: string;
  activeName: string;
  setActiveName: (name: string) => void;
  disabled: string[];
}

export const ViewWrapper: React.FC<IViewWrapperProps> = ({ children, displayType, name, type, activeName, setActiveName, disabled }) => {
  switch (displayType) {
    case DisplayType.NESTED:
      return <div style={{ margin: '4px 0' }}>{children}</div>;
    case DisplayType.POPOVER:
      return (
        <PopoverWrapper
          open={activeName === name}
          toggleOpen={(v: boolean) => setActiveName(v ? name : '')}
          children={children}
          title={<IconRenderer name={name} type={type} />}
          buttonIcon={<IconRenderer name={name} type={type} />}
          disabled={disabled.includes(name)}
        />
      );
    case DisplayType.DRAWER:
      return (
        <DrawerWrapper
          open={activeName === name}
          toggleOpen={(v: boolean) => setActiveName(v ? name : '')}
          children={children}
          title={<IconRenderer name={name} type={type} />}
          buttonIcon={<IconRenderer name={name} type={type} />}
          disabled={disabled.includes(name)}
        />
      );
    case DisplayType.HIDDEN:
      return <></>;
  }
};
