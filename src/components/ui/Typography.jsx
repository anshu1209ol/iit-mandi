import React from 'react';
import { cn } from '../../lib/utils';

export function Heading({
  as: Component = 'h2',
  size = 'md',
  className,
  children,
  ...props
}) {
  const sizes = {
    display: 'text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-display text-slate-900',
    xl: 'text-3xl sm:text-4xl font-bold tracking-tight font-display text-slate-900',
    lg: 'text-2xl sm:text-3xl font-bold tracking-tight font-display text-slate-900',
    md: 'text-xl sm:text-2xl font-bold tracking-normal text-slate-900',
    sm: 'text-lg font-semibold tracking-normal text-slate-800',
  };

  return (
    <Component className={cn(sizes[size] || sizes.md, className)} {...props}>
      {children}
    </Component>
  );
}

export function Text({
  as: Component = 'p',
  variant = 'body',
  className,
  children,
  ...props
}) {
  const variants = {
    lead: 'text-lg sm:text-xl text-slate-600 leading-relaxed font-normal',
    body: 'text-base text-slate-600 leading-relaxed',
    subtle: 'text-sm text-slate-500 leading-normal',
    caption: 'text-xs text-slate-500 font-semibold tracking-wider uppercase',
    mono: 'font-mono text-sm text-primary-600 tracking-tight font-semibold',
  };

  return (
    <Component className={cn(variants[variant] || variants.body, className)} {...props}>
      {children}
    </Component>
  );
}
