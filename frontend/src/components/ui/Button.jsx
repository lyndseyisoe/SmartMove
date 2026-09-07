import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const VARIANTS = {
  primary:
    'gradient-primary text-white shadow-sm hover:brightness-105 active:brightness-95 disabled:opacity-50',
  secondary:
    'bg-[var(--color-teal-light)] text-[var(--color-teal-dark)] hover:bg-[#cdf1ec] disabled:opacity-50',
  outline:
    'bg-transparent text-[var(--color-navy)] border border-[var(--color-border)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)] disabled:opacity-50',
  danger:
    'bg-[#dc2626] text-white hover:bg-[#c81e1e] disabled:opacity-50',
  ghost:
    'bg-transparent text-[var(--color-slate)] hover:bg-[var(--color-bg)] hover:text-[var(--color-navy)] disabled:opacity-50',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-5 py-3 gap-2',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </Component>
  );
}
