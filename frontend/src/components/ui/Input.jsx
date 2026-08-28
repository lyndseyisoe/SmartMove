import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(function Input(
  { label, error, hint, className, id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-navy)]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={cn(
          'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[var(--color-navy)] placeholder:text-[var(--color-slate)]/70 transition-colors',
          'border-[var(--color-border)] focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/20',
          error && 'border-[#dc2626] focus:border-[#dc2626] focus:ring-[#dc2626]/15',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-[#dc2626]">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-[var(--color-slate)]">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
