import { Inbox, AlertTriangle } from 'lucide-react';
import Button from './Button';

export function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-white/60 px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-teal-light)] text-[var(--color-teal-dark)]">
        <Icon className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-[var(--color-navy)]">{title}</h3>
      {description && <p className="max-w-sm text-sm text-[var(--color-slate)]">{description}</p>}
      {actionLabel && (
        <Button size="sm" onClick={onAction} className="mt-1">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We ran into a problem loading this. Please try again.',
  actionLabel = 'Retry',
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-[#fde8e8] text-[#dc2626]">
        <AlertTriangle className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-[var(--color-navy)]">{title}</h3>
      <p className="max-w-sm text-sm text-[var(--color-slate)]">{description}</p>
      {onAction && (
        <Button size="sm" variant="outline" onClick={onAction} className="mt-1">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
