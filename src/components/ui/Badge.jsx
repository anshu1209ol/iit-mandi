import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  icon,
  ...props
}) {
  const variants = {
    default: 'bg-surface-raised text-slate-200 border-surface-border',
    primary: 'bg-primary-950/70 text-primary-300 border-primary-500/40 shadow-sm',
    emerald: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-sm',
    cyan: 'bg-cyber-cyan/15 text-cyber-sky border-cyber-cyan/40 shadow-sm',
    violet: 'bg-purple-950/70 text-purple-300 border-purple-500/40 shadow-sm',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    forest: 'bg-forest-900/60 text-forest-200 border-forest-600/30',
    outline: 'bg-surface-raised/40 text-slate-300 border-surface-border',
    pulse: 'bg-primary-500/15 text-primary-300 border-primary-500/40',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border tracking-wide font-sans select-none',
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
