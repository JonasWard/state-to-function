import { SettingOutlined } from '@ant-design/icons';
import { Popover, Tooltip } from 'antd';
import React from 'react';
import { Settings, useUIStore } from '../../state/uiStore';
import styles from '../layout/AppHeader.module.css';
import sectionStyles from '../layout/Section.module.css';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Switch';

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
      <p className={sectionStyles.label}>Settings</p>
      {(Object.keys(LABELS) as (keyof Settings)[]).map((key) => (
        <label key={key} className={styles.setting}>
          {LABELS[key]}
          <Switch checked={settings[key]} onChange={(v) => setSetting(key, v)} />
        </label>
      ))}
    </div>
  );
};

export const SettingsPopover: React.FC = () => (
  <Popover trigger="click" placement="bottomRight" content={<SettingsList />}>
    <Tooltip title="Settings">
      <Button variant="text" icon={<SettingOutlined />} aria-label="Settings" />
    </Tooltip>
  </Popover>
);
