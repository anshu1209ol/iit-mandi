import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, Check } from 'lucide-react';

export function Label({
  htmlFor,
  required = false,
  className,
  children,
  ...props
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5', className)}
      {...props}
    >
      {children}
      {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
    </label>
  );
}

export const Input = React.forwardRef(({
  className,
  type = 'text',
  error,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      aria-invalid={!!error}
      className={cn(
        'w-full px-3.5 py-2.5 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-xs',
        error && 'border-rose-500 focus:ring-rose-500',
        className
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export const Textarea = React.forwardRef(({
  className,
  rows = 3,
  error,
  ...props
}, ref) => {
  return (
    <textarea
      rows={rows}
      ref={ref}
      aria-invalid={!!error}
      className={cn(
        'w-full px-3.5 py-2.5 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y shadow-xs',
        error && 'border-rose-500 focus:ring-rose-500',
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(({
  className,
  error,
  children,
  ...props
}, ref) => {
  return (
    <select
      ref={ref}
      aria-invalid={!!error}
      className={cn(
        'w-full px-3.5 py-2.5 rounded-xl text-sm bg-white text-slate-900 border border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-xs',
        error && 'border-rose-500 focus:ring-rose-500',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';

export function FormHelperText({ error, children, className }) {
  if (!children && !error) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 mt-1 text-xs',
        error ? 'text-rose-600' : 'text-slate-500',
        className
      )}
      role={error ? 'alert' : undefined}
    >
      {error && <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{error || children}</span>
    </div>
  );
}

export function FormHelper(props) {
  return <FormHelperText {...props} />;
}

export function FormError({ children, className }) {
  if (!children) return null;
  return <FormHelperText error={children} className={className} />;
}

export const Checkbox = React.forwardRef(({
  id,
  label,
  description,
  checked,
  onChange,
  className,
  ...props
}, ref) => {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="flex items-center h-5">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          id={id}
          ref={ref}
          onClick={() => onChange && onChange(!checked)}
          className={cn(
            'w-4 h-4 rounded border transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            checked
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-slate-300 bg-white hover:border-slate-400'
          )}
          {...props}
        >
          {checked && <Check className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />}
        </button>
      </div>
      <div className="text-xs">
        {label && (
          <label htmlFor={id} className="font-semibold text-slate-900 cursor-pointer select-none">
            {label}
          </label>
        )}
        {description && (
          <p className="text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
});
Checkbox.displayName = 'Checkbox';
