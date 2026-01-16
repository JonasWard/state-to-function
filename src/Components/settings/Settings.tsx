import { SettingOutlined } from '@ant-design/icons';
import { Popover, Button } from 'antd';
import React from 'react';
import { ShowNamesInAppletCheckbox } from './ShowAppletNames';
import { useGlobalUIStore } from '../../state/globalUIStore';
import { ShowAdditionalDefinitionInformation } from './ShowAdditionalDefinitionInformation';
import { HideNameAndSubscript } from './HideNameAndSubscript';

export const SettingsComponent: React.FC = () => {
  const uiInFocus = useGlobalUIStore((s) => s.uiInFocus);

  return (
    <Popover
      title="Settings"
      placement="bottomRight"
      trigger="click"
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {uiInFocus === 'applet' && <ShowNamesInAppletCheckbox />}
          {uiInFocus !== 'applet' && <ShowAdditionalDefinitionInformation />}
          {uiInFocus !== 'applet' && <HideNameAndSubscript />}
        </div>
      }
    >
      <Button type="text" icon={<SettingOutlined />} />
    </Popover>
  );
};
