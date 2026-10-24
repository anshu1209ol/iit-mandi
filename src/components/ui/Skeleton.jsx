import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-md bg-white/[0.06] border border-white/[0.02]',
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-panel p-6 rounded-card border border-surface-border space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-16 w-full" />
      <div className="pt-2 flex items-center gap-2">
        <Skeleton className="h-8 w-20 rounded-button" />
        <Skeleton className="h-8 w-24 rounded-button" />
      </div>
    </div>
  );
}
