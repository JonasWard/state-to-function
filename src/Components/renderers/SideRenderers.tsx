import { Button, Drawer } from 'antd';
import React from 'react';
import { useEffect, useState } from 'react';

type SideRendererWrapperProps = {
  children: React.ReactNode;
  placement: 'left' | 'right';
  title: string;
};

const DrawerRenderer: React.FC<SideRendererWrapperProps> = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Drawer mask={false} open={open} onClose={() => setOpen(false)} {...props} />
      <Button onClick={() => setOpen(true)}>{`Edit ${props.title}`}</Button>
    </>
  );
};

const DesktopRenderer: React.FC<SideRendererWrapperProps> = ({ children, title }) => (
  <div className="side-renderer-desktop">
    <span className="title">{`Edit ${title}`}</span>
    {children}
  </div>
);

export const SideRendererWrapper: React.FC<SideRendererWrapperProps> = (props) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop ? <DesktopRenderer {...props} /> : <DrawerRenderer {...props} />;
};
