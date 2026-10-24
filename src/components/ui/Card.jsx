import React from 'react';
import { cn } from '../../lib/utils';

export function Card({
  className,
  variant = 'glass',
  interactive = false,
  children,
  ...props
}) {
  const variants = {
    glass: 'bg-white/90 backdrop-blur-md border border-slate-200 rounded-card shadow-xs transition-all duration-200',
    solid: 'bg-white border border-slate-200 rounded-card shadow-xs transition-all duration-200',
    subtle: 'bg-slate-50 border border-slate-200 rounded-card',
    elevated: 'bg-white border border-slate-200 shadow-elevated rounded-card',
  };

  const interactiveStyles = interactive ? 'hover:border-primary-400 hover:translate-y-[-2px] hover:shadow-md cursor-pointer' : '';

  return (
    <div
      className={cn(variants[variant] || variants.glass, interactiveStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('p-5 sm:p-6 pb-2 sm:pb-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-display', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-sm text-slate-600 mt-1 leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('p-5 sm:p-6 pt-2 sm:pt-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('p-5 sm:p-6 pt-0 border-t border-slate-100 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}
