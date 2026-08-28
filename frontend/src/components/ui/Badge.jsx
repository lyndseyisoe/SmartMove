import { cn } from '../../utils/cn';
import { STATUS_META } from '../../utils/constants';

const COLOR_CLASSES = {
  pending: 'text-[var(--color-status-pending)] bg-[var(--color-status-pending-bg)]',
  confirmed: 'text-[var(--color-status-confirmed)] bg-[var(--color-status-confirmed-bg)]',
  progress: 'text-[var(--color-status-progress)] bg-[var(--color-status-progress-bg)]',
  completed: 'text-[var(--color-status-completed)] bg-[var(--color-status-completed-bg)]',
  cancelled: 'text-[var(--color-status-cancelled)] bg-[var(--color-status-cancelled-bg)]',
  neutral: 'text-[var(--color-slate)] bg-[var(--color-bg)]',
};

export default function Badge({ status, color, children, className }) {
  const meta = status ? STATUS_META[status] : null;
  const resolvedColor = color || meta?.color || 'neutral';
  const label = children ?? meta?.label ?? status;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        COLOR_CLASSES[resolvedColor],
        className
      )}
    >
      {label}
    </span>
  );
}
