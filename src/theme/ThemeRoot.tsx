import { App as AntApp, ConfigProvider } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { bindNotify } from '../state/notify';
import { getTheme } from './theme';

const NotifyBridge: React.FC = () => {
  const { message } = AntApp.useApp();
  useEffect(() => bindNotify(message), [message]);
  return null;
};

const reducedMotionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)');

export const ThemeRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(() => reducedMotionQuery().matches);
  useEffect(() => {
    const q = reducedMotionQuery();
    const onChange = () => setReducedMotion(q.matches);
    q.addEventListener('change', onChange);
    return () => q.removeEventListener('change', onChange);
  }, []);
  const theme = useMemo(() => getTheme(reducedMotion), [reducedMotion]);
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <NotifyBridge />
        {children}
      </AntApp>
    </ConfigProvider>
  );
};
