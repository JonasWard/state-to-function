import React from 'react';

export const IconTitle: React.FC<{
  icon: React.ReactNode;
  title: string;
  size?: 'small' | 'medium' | 'middle' | 'large';
}> = ({ icon, title, size = 'small' }) => (
  <span className={`help-icon-title ${size}`}>
    {icon}
    <span>{title}</span>
  </span>
);
