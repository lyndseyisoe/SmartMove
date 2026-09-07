import { LayoutDashboard, Calculator, Calendar, Truck, MessageCircle, UsersRound } from 'lucide-react';

export const CLIENT_NAV = [
  { label: 'Dashboard', to: '/client/dashboard', icon: LayoutDashboard },
  { label: 'Get Quote', to: '/client/quote', icon: Calculator },
  { label: 'Book a Move', to: '/client/book', icon: Calendar },
  { label: 'Bookings', to: '/client/bookings', icon: Truck },
  { label: 'Messages', to: '/client/messages', icon: MessageCircle },
  { label: 'Find Movers', to: '/client/movers', icon: UsersRound },
];

export function getNavForRole(role) {
  if (role === 'mover') {
    return [
      { label: 'Dashboard', to: '/client/dashboard', icon: LayoutDashboard },
      { label: 'Messages', to: '/client/messages', icon: MessageCircle },
      { label: 'My profile', to: '/mover/profile', icon: UsersRound },
    ];
  }
  return CLIENT_NAV;
}
