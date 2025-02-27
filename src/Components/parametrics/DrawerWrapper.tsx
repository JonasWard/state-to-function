import { CloseOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import React, { ReactNode } from 'react';

interface IDrawerWrapperProps {
  open: boolean;
  toggleOpen: (open: boolean) => void;
  children: ReactNode;
  title: ReactNode;
  buttonIcon: ReactNode;
  disabled?: boolean;
}

export const DrawerWrapper: React.FC<IDrawerWrapperProps> = ({ open, toggleOpen, children, title, buttonIcon, disabled }) => (
  <>
    <Drawer
      placement='right'
      style={{ backgroundColor: '#ffffffb0', width: 'calc(100vw - 64px)' }}
      open={open}
      styles={{ wrapper: { width: 'calc(100vw - 64px)' }, mask: { background: '#ffffff00' } }}
      onClose={() => toggleOpen(false)}
      title={
        <div
          style={{
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
      {children}
    </Drawer>
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'start', margin: 8 }}>
      <Button disabled={disabled} onClick={() => toggleOpen(!open)} style={{ width: 20 }}>
        {buttonIcon}
      </Button>
    </div>
  </>
);
