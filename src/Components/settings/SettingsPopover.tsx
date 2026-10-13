import { SettingOutlined } from '@ant-design/icons';
import { Button, Popover, Switch, Tooltip } from 'antd';
import React from 'react';
import { Settings, useUIStore } from '../../state/uiStore';
import styles from '../layout/AppHeader.module.css';

const LABELS: Record<keyof Settings, string> = {
  compactRows: 'Compact definition rows',
  showNamesInApplet: 'Show names in the applet',
  showRangeHints: 'Show input ranges in the applet'
};

const SettingsList: React.FC = () => {
  const settings = useUIStore((s) => s.settings);
  const setSetting = useUIStore((s) => s.setSetting);
  return (
    <div className={styles.settings}>
      {(Object.keys(LABELS) as (keyof Settings)[]).map((key) => (
        <label key={key} className={styles.setting}>
          {LABELS[key]}
          <Switch size="small" checked={settings[key]} onChange={(v) => setSetting(key, v)} />
        </label>
      ))}
    </div>
  );
};

export const SettingsPopover: React.FC = () => (
  <Popover trigger="click" placement="bottomRight" title="Settings" content={<SettingsList />}>
    <Tooltip title="Settings">
      <Button type="text" icon={<SettingOutlined />} aria-label="Settings" />
    </Tooltip>
  </Popover>
);
