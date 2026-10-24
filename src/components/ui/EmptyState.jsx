import React from 'react';
import { cn } from '../../lib/utils';
import { Inbox } from 'lucide-react';

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'glass-panel rounded-card p-8 sm:p-12 text-center flex flex-col items-center justify-center border border-dashed border-surface-border',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center text-slate-400 mb-4 border border-surface-border">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      {title && (
        <h3 className="text-base font-semibold text-slate-200 font-display">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-slate-400 mt-1 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
