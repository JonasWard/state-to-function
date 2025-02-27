import { Slider } from 'antd';
import React, { ReactNode, useState } from 'react';

const LogarithmicSlider: React.FC<{ value: number; setValue: (v: number) => void; min?: number; precision?: number; max?: number; valueBefore?: string }> = ({
  min = -5,
  max = 5,
  precision = 0,
  value,
  setValue,
}) => {
  const updateValue = (v: number) => setValue(10 ** v);

  return (
    <Slider
      className='slider'
      max={Math.log10(max)}
      min={Math.log10(min)}
      onChange={updateValue}
      step={0.001}
      style={{ width: '100%', margin: '5px 0' }}
      tooltip={{ formatter: (v) => `${(10 ** (v ?? 0)).toFixed(precision)}` }}
      value={Math.log10(value)}
    />
  );
};

const isLogaritmic = (bits: number) => bits > 16;

export const SliderWrapper: React.FC<{
  icon: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  precision: number;
  bits: number;
}> = ({ value, onChange, min, max, step, icon, precision, bits }) => {
  const [localInputValue, setLocalInputValue] = useState<number | null | undefined>(undefined);
  return value || value === 0 ? (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
        <div>{icon}</div>
        <input
          type='number'
          style={{ backgroundColor: '#ffffff00', border: 'none' }}
          min={min}
          max={max}
          step={step}
          value={localInputValue !== undefined ? (localInputValue === null ? '' : localInputValue) : value.toFixed(Math.max(precision, 0))}
          onChange={(e) => setLocalInputValue(e.target.value === '' ? null : Number(e.target.value))}
          onBlur={() => {
            localInputValue !== undefined && onChange(localInputValue ?? 0);
            setLocalInputValue(undefined);
          }}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              localInputValue !== undefined && onChange(localInputValue ?? 0);
              setLocalInputValue(undefined);
            }
          }}
        />
      </div>
      {isLogaritmic(bits) ? (
        <LogarithmicSlider
          value={localInputValue !== null && localInputValue !== undefined ? localInputValue : value}
          setValue={onChange}
          min={min}
          max={max}
          precision={precision}
        />
      ) : (
        <Slider style={{ width: '100%', margin: '5px 0' }} value={value} onChange={onChange} min={min} max={max} step={step} />
      )}
    </div>
  ) : (
    <span>Value is not valid</span>
  );
};
