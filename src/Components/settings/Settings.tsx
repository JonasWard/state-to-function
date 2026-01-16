import { SettingOutlined } from '@ant-design/icons';
import { Popover, Button } from 'antd';
import React from 'react';
import { ShowNamesInAppletCheckbox } from './ShowAppletNames';
import { useGlobalUIStore } from '../../state/globalUIStore';
import { ShowAdditionalDefinitionInformation } from './ShowAdditionalDefinitionInformation';

export const SettingsComponent: React.FC = () => {
  const uiInFocus = useGlobalUIStore((s) => s.uiInFocus);

  return (
    <Popover
      title="Settings"
      placement="bottomRight"
      trigger="click"
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 200 }}>
          {uiInFocus === 'applet' && <ShowNamesInAppletCheckbox />}
          {uiInFocus !== 'applet' && <ShowAdditionalDefinitionInformation />}
        </div>
      }
    >
      <Button icon={<SettingOutlined />} />
    </Popover>
  );
};
