import { CircleQuestionMark, Hash, Link, RotateCcw, RotateCw, Signature, SquareFunction, SquarePen } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import React from 'react';
import { selectCanRedo, selectCanUndo, useDocumentStore } from '../../state/documentStore';
import { buildShareUrl } from '../../state/hashSync';
import { notify } from '../../state/notify';
import { useUIStore } from '../../state/uiStore';
import { SettingsPopover } from '../settings/SettingsPopover';
import styles from './AppHeader.module.css';
import { Button } from '../ui/Button';
import { Segmented, SegmentedOption } from '../ui/Segmented';
import { useMediaQuery, WIDE } from '../ui/useMediaQuery';

type Tab = 'help' | 'edit' | 'inputs' | 'methods' | 'applet';

const option = (value: Tab, icon: React.ReactNode, text: string, showText: boolean): SegmentedOption<Tab> => ({
  value,
  label: (
    <>
      {icon} {showText && text}
    </>
  ),
  ariaLabel: text,
  title: text
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
        option('help', <CircleQuestionMark />, 'Help', true),
        option('edit', <SquarePen />, 'Definitions', true),
        option('applet', <Signature />, 'Applet', true)
      ]
    : [
        option('help', <CircleQuestionMark />, 'Help', false),
        option('inputs', <Hash />, 'Inputs', false),
        option('methods', <SquareFunction />, 'Methods', false),
        option('applet', <Signature />, 'Applet', false)
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
        <Segmented ariaLabel="Page" value={current} options={options} onChange={select} />
        <div className={styles.actions}>
          <IconButton label="Undo" icon={<RotateCcw />} disabled={!canUndo} onClick={() => useDocumentStore.getState().undo()} />
          <IconButton label="Redo" icon={<RotateCw />} disabled={!canRedo} onClick={() => useDocumentStore.getState().redo()} />
          <IconButton label="Copy link" icon={<Link />} onClick={copyLink} />
          <SettingsPopover />
        </div>
      </div>
    </header>
  );
};
