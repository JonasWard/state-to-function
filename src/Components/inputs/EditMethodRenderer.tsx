import { Drawer } from 'antd';
import { MethodEntry } from '../../modelDefinition/types/version0.data.type';
import React from 'react';
import { EditMethodContentRenderer } from './InputComponent';
import { MethodTitle } from '../renderers/MethodTitle';

const EditMethodRendererMobile: React.FC<{ method: MethodEntry | undefined; clearMethod: () => void }> = ({ method, clearMethod }) => (
  <>
    <Drawer
      mask={false}
      open={Boolean(method)}
      onClose={clearMethod}
      title={
        method ? (
          <>
            Edit: <MethodTitle method={method} />
          </>
        ) : null
      }
    >
      {method ? <EditMethodContentRenderer method={method} /> : null}
    </Drawer>
  </>
);

const EditMethodRendererDesktop: React.FC<{ method: MethodEntry | undefined; clearMethod: () => void }> = ({ method }) =>
  method ? (
    <div style={{ width: 450, padding: 10 }}>
      <span style={{ paddingBottom: 20, fontWeight: 600 }}>
        Edit: <MethodTitle method={method} />
      </span>
      <EditMethodContentRenderer method={method} />
    </div>
  ) : (
    <div style={{ width: 450, padding: 10 }} />
  );

export const EditMethodRenderer: React.FC<{ method: MethodEntry | undefined; desktop?: boolean; clearMethod: () => void }> = (props) =>
  props.desktop ? <EditMethodRendererDesktop {...props} /> : <EditMethodRendererMobile {...props} />;
