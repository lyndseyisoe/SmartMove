import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { cn } from '../../utils/cn';
import { initials } from '../../utils/format';
import { logout } from '../../features/auth/authSlice';

export default function Navbar({ onMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="flex h-[76px] items-center justify-between border-b border-[var(--color-border)] bg-white/85 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-md p-2 text-[var(--color-slate)] hover:bg-[var(--color-bg)] md:hidden"
        >
          <Menu className="size-5" />
        </button>
        <span className="text-[15px] font-bold text-[var(--color-navy)] md:hidden">Smart<span className="text-[var(--color-teal)]">Move</span></span>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full p-1 hover:bg-[var(--color-bg)]"
          aria-label="Account menu"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-[var(--color-teal-light)] text-xs font-bold text-[var(--color-teal-dark)] ring-4 ring-[var(--color-teal-light)]/40">
            {initials(user?.name) || <UserIcon className="size-4" />}
          </div>
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-lg">
              <div className="border-b border-[var(--color-border)] px-3.5 py-3">
                <p className="truncate text-sm font-medium text-[var(--color-navy)]">
                  {user?.name || 'Account'}
                </p>
                <p className="truncate text-xs text-[var(--color-slate)]">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className={cn(
                  'flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-[#dc2626] hover:bg-[#fde8e8]'
                )}
              >
                <LogOut className="size-4" /> Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
