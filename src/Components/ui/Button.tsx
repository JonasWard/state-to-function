import React from 'react';
import styles from './Button.module.css';
import { Spinner } from './Spinner';

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'default' | 'primary' | 'dashed' | 'text';
  size?: 'default' | 'small';
  icon?: React.ReactNode;
  loading?: boolean;
  block?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  icon,
  loading = false,
  block = false,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}) => (
  <button
    type={type}
    className={[
      styles.button,
      variant !== 'default' && styles[variant],
      size === 'small' && styles.small,
      block && styles.block,
      !children && styles.iconOnly,
      className
    ]
      .filter(Boolean)
      .join(' ')}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {...rest}
  >
    {loading ? <Spinner size="small" /> : icon}
    {children}
  </button>
);
