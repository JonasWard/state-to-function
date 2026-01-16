import { Checkbox } from 'antd';
import { useGlobalUIStore } from '../../state/globalUIStore';
import React from 'react';

export const HideNameAndSubscript: React.FC = () => {
  const hideNameAndSubscriptInInput = useGlobalUIStore((s) => s.hideNameAndSubscriptInInput);
  const setHideNameAndSubscriptInInput = useGlobalUIStore((s) => s.setHideNameAndSubscriptInInput);

  return (
    <Checkbox
      checked={hideNameAndSubscriptInInput}
      onChange={() => setHideNameAndSubscriptInInput(!hideNameAndSubscriptInInput)}
      children={'Hide Name and Subscript'}
    />
  );
};
