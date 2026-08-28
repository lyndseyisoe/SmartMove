import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center gradient-soft px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg gradient-primary text-white">
            <Truck className="size-[18px]" />
          </div>
          <span className="text-lg font-bold text-[var(--color-navy)]">SmartMove</span>
        </Link>

        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-7 shadow-[var(--shadow-card)] sm:p-8">
          <h1 className="text-xl font-bold text-[var(--color-navy)]">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-[var(--color-slate)]">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-5 text-center text-sm text-[var(--color-slate)]">{footer}</div>}
      </div>
    </div>
  );
}
