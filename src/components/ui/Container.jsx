import React from 'react';
import { cn } from '../../lib/utils';

export function Container({
  className,
  size = 'default',
  children,
  ...props
}) {
  const sizes = {
    narrow: 'max-w-4xl',
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8', sizes[size] || sizes.default, className)}
      {...props}
    >
      {children}
    </div>
  );
}
