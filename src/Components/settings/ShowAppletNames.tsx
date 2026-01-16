import { Checkbox } from 'antd';
import { useGlobalUIStore } from '../../state/globalUIStore';
import React from 'react';

export const ShowNamesInAppletCheckbox: React.FC = () => {
  const showNamesInApplet = useGlobalUIStore((s) => s.showNamesInApplet);
  const setShowNamesInApplet = useGlobalUIStore((s) => s.setShowNamesInApplet);

  return (
    <Checkbox
      checked={showNamesInApplet}
      onChange={() => setShowNamesInApplet(!showNamesInApplet)}
      children={'Show Names in Applet'}
    />
  );
};
