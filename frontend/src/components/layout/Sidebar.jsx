import { NavLink } from 'react-router-dom';
import { Truck, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { getNavForRole } from './navConfig';

function NavItems({ role, onNavigate }) {
  const items = getNavForRole(role);
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto scrollbar-thin px-3 py-2">
      {items.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={label}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-[var(--color-teal-light)] text-[var(--color-teal-dark)]'
                : 'text-[var(--color-slate)] hover:translate-x-0.5 hover:bg-[var(--color-bg)] hover:text-[var(--color-navy)]'
            )
          }
        >
          <Icon className="size-[18px] shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-5 py-6">
      <div className="flex size-9 items-center justify-center rounded-xl gradient-primary text-white shadow-md shadow-teal/20">
        <Truck className="size-4" />
      </div>
      <span className="text-lg font-extrabold tracking-tight text-[var(--color-navy)]">Smart<span className="text-[var(--color-teal)]">Move</span></span>
    </div>
  );
}

/** Persistent desktop/tablet sidebar. */
export function Sidebar({ role }) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-[var(--color-border)] md:bg-white">
      <Brand />
      <NavItems role={role} />
    </aside>
  );
}

/** Mobile drawer sidebar. */
export function MobileSidebar({ role, open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div className="absolute inset-0 bg-[var(--color-navy)]/40" onClick={onClose} aria-hidden="true" />
      <div className="relative flex w-72 max-w-[80%] flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between pr-3">
          <Brand />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-2 text-[var(--color-slate)] hover:bg-[var(--color-bg)]"
          >
            <X className="size-5" />
          </button>
        </div>
        <NavItems role={role} onNavigate={onClose} />
      </div>
    </div>
  );
}
