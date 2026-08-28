import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Spinner({ className, size = 20 }) {
  return <Loader2 className={cn('animate-spin text-[var(--color-teal)]', className)} size={size} />;
}

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-[var(--color-slate)]">
      <Spinner size={28} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-md bg-[var(--color-border)]/60', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-5">
      <Skeleton className="mb-3 h-4 w-1/3" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
