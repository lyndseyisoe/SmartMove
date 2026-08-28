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
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-[var(--color-teal-light)] text-[var(--color-teal-dark)]'
                : 'text-[var(--color-slate)] hover:bg-[var(--color-bg)] hover:text-[var(--color-navy)]'
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
    <div className="flex items-center gap-2 px-5 py-5">
      <div className="flex size-8 items-center justify-center rounded-lg gradient-primary text-white">
        <Truck className="size-4" />
      </div>
      <span className="text-[15px] font-bold text-[var(--color-navy)]">SmartMove</span>
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
