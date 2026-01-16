import { Checkbox } from 'antd';
import { useGlobalUIStore } from '../../state/globalUIStore';
import React from 'react';

export const ShowNamesInAppletCheckbox: React.FC = () => {
  const { showNamesInApplet, setShowNamesInApplet } = useGlobalUIStore();

  return (
    <Checkbox
      style={{ position: 'fixed', right: 10, top: 13 }}
      checked={showNamesInApplet}
      onChange={() => setShowNamesInApplet(!showNamesInApplet)}
    >
      Names
    </Checkbox>
  );
};
