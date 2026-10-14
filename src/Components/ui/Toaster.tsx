import React from 'react';
import { useToasts } from '../../state/notify';
import styles from './Toaster.module.css';

/** Always rendered, so screen readers announce toasts added to the live region later. */
export const Toaster: React.FC = () => {
  const toasts = useToasts((s) => s.toasts);
  return (
    <div className={styles.region} role="status" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.level]}`}>
          <span className={styles.dot} aria-hidden />
          {t.text}
        </div>
      ))}
    </div>
  );
};
