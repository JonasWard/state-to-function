import { Checkbox } from 'antd';
import { useGlobalUIStore } from '../../state/globalUIStore';
import React from 'react';

export const ShowNamesInAppletCheckbox: React.FC = () => {
  const { showNamesInApplet, setShowNamesInApplet } = useGlobalUIStore();

  return (
    <Checkbox
      checked={showNamesInApplet}
      onChange={() => setShowNamesInApplet(!showNamesInApplet)}
      children={'Show Names in Applet'}
    />
  );
};
