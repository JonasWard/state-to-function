import React, { useState } from 'react';
import { Button } from './Button';
import styles from './overlay.module.css';
import { Popover } from './Popover';

/** Asks before a destructive action; the trigger opens it and the confirm button runs `onConfirm`. */
export const Confirm: React.FC<{
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  children: React.ReactElement<Record<string, unknown>>;
}> = ({ title, description, confirmText, onConfirm, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      placement="bottom-end"
      label={title}
      content={
        <div className={styles.confirm}>
          <p className={styles.confirmTitle}>{title}</p>
          <p className={styles.confirmText}>{description}</p>
          <div className={styles.confirmActions}>
            <Button size="small" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="small" variant="primary" onClick={() => (setOpen(false), onConfirm())}>
              {confirmText}
            </Button>
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  );
};
