import { InputNumber, InputNumberProps } from 'antd';
import React, { useEffect, useState } from 'react';

export const InputNumberWrapper: React.FC<InputNumberProps & { onChange: (v: number | null) => void }> = ({
  onChange,
  value,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <InputNumber
      value={internalValue}
      onPressEnter={() => onChange!(internalValue === null ? null : Number(internalValue))}
      onBlur={() => onChange!(internalValue === null ? null : Number(internalValue))}
      onChange={setInternalValue}
      {...props}
    />
  );
};
