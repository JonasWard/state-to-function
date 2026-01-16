import { Checkbox } from 'antd';
import { useGlobalUIStore } from '../../state/globalUIStore';
import React from 'react';

export const ShowAdditionalDefinitionInformation: React.FC = () => {
  const { showAdditionalDefinitionInformation, setShowAdditionalDefinitionInformation } = useGlobalUIStore();

  return (
    <Checkbox
      checked={showAdditionalDefinitionInformation}
      onChange={() => setShowAdditionalDefinitionInformation(!showAdditionalDefinitionInformation)}
      children={'Show Helper Info'}
    />
  );
};
