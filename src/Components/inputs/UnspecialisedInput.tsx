// import { SaveOutlined } from '@ant-design/icons';
import { Drawer, Button } from 'antd';
import { version0EnumSemantics } from '../../modelDefinition/types/version0.enumsemantics';
import { ParametricInput } from '../parametrics/ParametricInput';
import React, { useState } from 'react';

export const UnspecialisedInput: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} style={{ position: 'absolute', right: 10, bottom: 50 }}>
        edit UnspecialisedInput
      </Button>
      <Drawer open={open} mask={false} onClose={() => setOpen(false)}>
        <ParametricInput versionEnumSemantics={version0EnumSemantics} />
        {/* {localStorage.getItem('iAmJonas') === 'true' ? (
          <Button style={{ position: 'fixed', top: '15px', right: '15px' }} onClick={downloadPNG}>
            <SaveOutlined style={{ position: 'absolute', width: 20, height: 20 }} size={16} />
          </Button>
        ) : null} */}
      </Drawer>
    </>
  );
};
