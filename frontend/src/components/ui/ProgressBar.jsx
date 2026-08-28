import { cn } from '../../utils/cn';

export default function ProgressBar({ value = 0, className }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]', className)}>
      <div
        className="h-full gradient-primary rounded-full transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

export function Steps({ steps, current }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 flex-col gap-1.5">
              <div
                className={cn(
                  'h-1.5 rounded-full transition-colors',
                  isDone || isActive ? 'gradient-primary' : 'bg-[var(--color-border)]'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-[var(--color-teal-dark)]' : 'text-[var(--color-slate)]'
                )}
              >
                {stepNum}. {step}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
