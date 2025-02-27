import { CloseOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React, { ReactNode } from 'react';

interface IPopoverWrapperProps {
  open: boolean;
  toggleOpen: (open: boolean) => void;
  children: ReactNode;
  title: ReactNode;
  buttonIcon: ReactNode;
  disabled?: boolean;
}

export const PopoverWrapper: React.FC<IPopoverWrapperProps> = ({ open, toggleOpen, children, title, buttonIcon, disabled }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'start' }}>
      <Popover
        placement='leftTop'
        open={open}
        onOpenChange={toggleOpen}
        trigger='click'
        color='#ffffffb0'
        content={<div style={{ width: 'min(250px, calc(100vw - 96px))' }}>{children}</div>}
        title={
          <div
            style={{
              margin: '0px 0px 4px 0px',
              paddingBottom: '6px',
              width: 'calc(min(250px, calc(100vw - 96px)) -16px)',
              borderBottom: '1px solid black',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{title}</span>
            <CloseOutlined style={{ cursor: 'pointer' }} size={20} onClick={() => toggleOpen(false)} />
          </div>
        }
      >
        <Button disabled={disabled} style={{ margin: 8, width: 20 }}>
          {buttonIcon}
        </Button>
      </Popover>
    </div>
  );
};
