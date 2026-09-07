import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const Select = forwardRef(function Select(
  { label, error, hint, className, id, children, ...props },
  ref
) {
  const selectId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[var(--color-navy)]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-9 text-sm text-[var(--color-navy)] transition-colors',
            'border-[var(--color-border)] focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/20',
            error && 'border-[#dc2626] focus:border-[#dc2626] focus:ring-[#dc2626]/15',
            className
          )}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-slate)]" />
      </div>
      {error && <p className="text-xs text-[#dc2626]">{error}</p>}
      {!error && hint && <p className="text-xs text-[var(--color-slate)]">{hint}</p>}
    </div>
  );
});

export default Select;
