import { Button, Drawer } from 'antd';
import { NumericInputs, MethodEntry } from '../../modelDefinition/types/version0.data.type';
import { useState } from 'react';
import React from 'react';
import { EditMethodContentRenderer } from './InputComponent';
import { getText } from '../../lib/helpers';
import { AttributeNames } from '../../modelDefinition/enums/attributeNames';
import { validDescriptors } from '../../modelDefinition/enums/chars';
import { SymbolRenderer } from './SymbolRenderer';
import { SubscriptRenderer } from './SubscriptRenderer';
import { EditOutlined } from '@ant-design/icons';

const MethodTitle: React.FC<{ method: MethodEntry }> = ({ method }) => {
  const descriptionText = getText(method[AttributeNames.FunctionOutput][AttributeNames.NumericInputName].v, validDescriptors);

  return descriptionText != '' ? (
    descriptionText
  ) : (
    <span style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
      Method:
      <var>
        <SymbolRenderer symbol={method[AttributeNames.FunctionOutput][AttributeNames.NumericScientificSymbol].value} />
        <SubscriptRenderer subscriptIndexes={method[AttributeNames.FunctionOutput][AttributeNames.NumericScientificSubscript]} />
      </var>
    </span>
  );
};

export const EditMethodRenderer: React.FC<{ method: MethodEntry; numericInputs: NumericInputs }> = ({ method, numericInputs }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Drawer
        mask={false}
        open={open}
        onClose={() => setOpen(false)}
        title={
          <>
            Edit: <MethodTitle method={method} />
          </>
        }
      >
        <EditMethodContentRenderer method={method} numericInputs={numericInputs} />
      </Drawer>
      <Button onClick={() => setOpen(true)}>
        <EditOutlined /> <MethodTitle method={method} />
      </Button>
    </>
  );
};
