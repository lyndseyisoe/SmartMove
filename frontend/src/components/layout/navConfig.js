import { LayoutDashboard, Calculator, Calendar, Truck } from 'lucide-react';

export const CLIENT_NAV = [
  { label: 'Dashboard', to: '/client/dashboard', icon: LayoutDashboard },
  { label: 'Get Quote', to: '/client/quote', icon: Calculator },
  { label: 'Book a Move', to: '/client/book', icon: Calendar },
  { label: 'Bookings', to: '/client/bookings', icon: Truck },
];

export function getNavForRole() {
  return CLIENT_NAV;
}
