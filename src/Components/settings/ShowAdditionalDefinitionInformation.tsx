import { Checkbox } from 'antd';
import { useGlobalUIStore } from '../../state/globalUIStore';
import React from 'react';

export const ShowAdditionalDefinitionInformation: React.FC = () => {
  const showAdditionalDefinitionInformation = useGlobalUIStore((s) => s.showAdditionalDefinitionInformation);
  const setShowAdditionalDefinitionInformation = useGlobalUIStore((s) => s.setShowAdditionalDefinitionInformation);

  return (
    <Checkbox
      checked={showAdditionalDefinitionInformation}
      onChange={() => setShowAdditionalDefinitionInformation(!showAdditionalDefinitionInformation)}
      children={'Show Helper Info'}
    />
  );
};
