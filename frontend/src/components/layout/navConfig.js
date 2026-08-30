import {
  LayoutDashboard,
  Calculator,
  Calendar,
  Truck,
  Briefcase,
  UserCheck,
  Users,
  Settings,
  BarChart3,
} from 'lucide-react';

export const CLIENT_NAV = [
  { label: 'Dashboard', to: '/client/dashboard', icon: LayoutDashboard },
  { label: 'Get Quote', to: '/client/quote', icon: Calculator },
  { label: 'Book a Move', to: '/client/book', icon: Calendar },
  { label: 'Bookings', to: '/client/bookings', icon: Truck },
  { label: 'Profile', to: '/profile', icon: Settings },
];

export const MOVER_NAV = [
  { label: 'Dashboard', to: '/mover/dashboard', icon: LayoutDashboard },
  { label: 'My Jobs', to: '/mover/jobs', icon: Briefcase },
  { label: 'Availability', to: '/mover/availability', icon: UserCheck },
  { label: 'Profile', to: '/profile', icon: Settings },
];

export const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Movers', to: '/admin/movers', icon: Briefcase },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Profile', to: '/profile', icon: Settings },
];

export function getNavForRole(role) {
  switch (role) {
    case 'client':
      return CLIENT_NAV;
    case 'mover':
      return MOVER_NAV;
    case 'admin':
      return ADMIN_NAV;
    default:
      return CLIENT_NAV;
  }
}
