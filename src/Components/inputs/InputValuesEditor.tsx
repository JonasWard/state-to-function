import { DeleteFilled, PlusCircleFilled } from '@ant-design/icons';
import { NumericInputs } from '../../modelDefinition/types/version0.data.type';
import { useMethodData } from '../../state/method';
import { ReferenceInputEditor } from './ReferenceInputEditor';
import React, { useState } from 'react';
import { Drawer, Button } from 'antd';

const NumericInputsEditor: React.FC<{ numericInputs: NumericInputs }> = ({ numericInputs }) => (
  <>
    {numericInputs.v.map((input, index) => (
      <>
        <ReferenceInputEditor key={'numericInputs-' + index} numericInput={input} />
        {numericInputs.s.value > numericInputs.s.min && index + 1 === numericInputs.s.value ? (
          <DeleteFilled
            style={{ cursor: 'pointer', position: 'relative', transform: 'translate(-14px, -45px)', color: 'lightgray' }}
            onClick={() => useMethodData.getState().updateDataEntry({ ...numericInputs.s, value: numericInputs.s.value - 1 })}
          />
        ) : null}
      </>
    ))}
    {numericInputs.s.value < numericInputs.s.max ? (
      <div style={{ width: 25, height: 35, justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
        <PlusCircleFilled
          style={{ cursor: 'pointer' }}
          onClick={() => useMethodData.getState().updateDataEntry({ ...numericInputs.s, value: numericInputs.s.value + 1 })}
        />
      </div>
    ) : null}
  </>
);

export const EditNumericInputsEditor: React.FC<{ numericInputs: NumericInputs }> = ({ numericInputs }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Drawer mask={false} placement='left' open={open} onClose={() => setOpen(false)} title={'Edit Inputs'}>
        <NumericInputsEditor numericInputs={numericInputs} />
      </Drawer>
      <Button style={{ position: 'absolute', left: 10, bottom: 10 }} onClick={() => setOpen(true)}>
        edit available inputs
      </Button>
    </>
  );
};
