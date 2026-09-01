import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Sidebar, MobileSidebar } from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = useSelector((s) => s.auth.user?.role);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <Sidebar role={role} />
      <MobileSidebar role={role} open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
