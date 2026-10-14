import {
  FormOutlined,
  FunctionOutlined,
  LinkOutlined,
  NumberOutlined,
  QuestionOutlined,
  RedoOutlined,
  SignatureOutlined,
  UndoOutlined
} from '@ant-design/icons';
import { Segmented, Tooltip } from 'antd';
import React from 'react';
import { selectCanRedo, selectCanUndo, useDocumentStore } from '../../state/documentStore';
import { buildShareUrl } from '../../state/hashSync';
import { notify } from '../../state/notify';
import { useUIStore } from '../../state/uiStore';
import { SettingsPopover } from '../settings/SettingsPopover';
import styles from './AppHeader.module.css';
import { Button } from '../ui/Button';
import { useMediaQuery, WIDE } from '../ui/useMediaQuery';

type Tab = 'help' | 'edit' | 'inputs' | 'methods' | 'applet';

const option = (value: Tab, icon: React.ReactNode, text: string, showText: boolean) => ({
  value,
  label: (
    <span aria-label={text} title={text}>
      {icon} {showText && text}
    </span>
  )
});

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(buildShareUrl());
    notify.success('Link copied');
  } catch {
    notify.error('Could not access the clipboard; copy the address bar instead.');
  }
};

const IconButton: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void; disabled?: boolean }> = ({
  label,
  ...props
}) => (
  <Tooltip title={label}>
    <Button variant="text" aria-label={label} {...props} />
  </Tooltip>
);

export const AppHeader: React.FC = () => {
  const wide = useMediaQuery(WIDE);
  const view = useUIStore((s) => s.view);
  const pane = useUIStore((s) => s.mobilePane);
  const canUndo = useDocumentStore(selectCanUndo);
  const canRedo = useDocumentStore(selectCanRedo);

  const options = wide
    ? [
        option('help', <QuestionOutlined />, 'Help', true),
        option('edit', <FormOutlined />, 'Definitions', true),
        option('applet', <SignatureOutlined />, 'Applet', true)
      ]
    : [
        option('help', <QuestionOutlined />, 'Help', false),
        option('inputs', <NumberOutlined />, 'Inputs', false),
        option('methods', <FunctionOutlined />, 'Methods', false),
        option('applet', <SignatureOutlined />, 'Applet', false)
      ];
  const current: Tab = view === 'edit' && !wide ? pane : view;

  const select = (tab: Tab) => {
    const ui = useUIStore.getState();
    if (tab === 'inputs' || tab === 'methods') {
      ui.setMobilePane(tab);
      ui.setView('edit');
    } else ui.setView(tab);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.brand}>
          <img className={styles.mark} src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" aria-hidden />
          {wide && <span className={styles.wordmark}>state→function</span>}
        </span>
        <Segmented value={current} options={options} onChange={(v) => select(v as Tab)} />
        <div className={styles.actions}>
          <IconButton label="Undo" icon={<UndoOutlined />} disabled={!canUndo} onClick={() => useDocumentStore.getState().undo()} />
          <IconButton label="Redo" icon={<RedoOutlined />} disabled={!canRedo} onClick={() => useDocumentStore.getState().redo()} />
          <IconButton label="Copy link" icon={<LinkOutlined />} onClick={copyLink} />
          <SettingsPopover />
        </div>
      </div>
    </header>
  );
};
