import { Checkbox } from 'antd';
import { useGlobalUIStore } from '../../state/globalUIStore';
import React from 'react';

export const ShowAdditionalDefinitionInformation: React.FC = () => {
  const { showAdditionalDefinitionInformation, setShowAdditionalDefinitionInformation } = useGlobalUIStore();

  return (
    <Checkbox
      style={{ position: 'fixed', right: 10, top: 13 }}
      checked={showAdditionalDefinitionInformation}
      onChange={() => setShowAdditionalDefinitionInformation(!showAdditionalDefinitionInformation)}
    >
      Additional Definition Information
    </Checkbox>
  );
};
