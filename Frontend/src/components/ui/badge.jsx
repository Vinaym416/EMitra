import React from 'react';

export default function Badge({ children, variant = 'primary' }) {
  const baseStyle = 'px-2 py-1 rounded-full text-xs font-semibold';
  const styles = {
    primary: 'bg-gray-200 text-gray-800',
    secondary: 'bg-yellow-100 text-yellow-800',
  };
  return <span className={`${baseStyle} ${styles[variant]}`}>{children}</span>;
}
