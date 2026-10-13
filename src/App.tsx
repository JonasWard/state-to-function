import { Spin } from 'antd';
import React, { useEffect } from 'react';
import styles from './App.module.css';
import { AppletView } from './applet/AppletView';
import { Help } from './Components/Help';
import { AppHeader } from './Components/layout/AppHeader';
import { DefinitionView } from './method/DefinitionView';
import { useDocumentStore } from './state/documentStore';
import { startHashSync } from './state/hashSync';
import { useKeyboardShortcuts } from './state/useKeyboardShortcuts';
import { useUIStore } from './state/uiStore';

export const App: React.FC = () => {
  useEffect(() => startHashSync(), []);
  useKeyboardShortcuts();
  const view = useUIStore((s) => s.view);
  const upgrading = useDocumentStore((s) => s.status === 'upgrading');
  return (
    <>
      <AppHeader />
      <main className={styles.main}>
        {upgrading ? (
          <div className={styles.loading}>
            <Spin tip="Upgrading link…" />
          </div>
        ) : view === 'help' ? (
          <Help />
        ) : view === 'applet' ? (
          <AppletView />
        ) : (
          <DefinitionView />
        )}
      </main>
    </>
  );
};
