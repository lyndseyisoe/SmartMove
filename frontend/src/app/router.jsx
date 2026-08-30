import { createBrowserRouter } from 'react-router-dom';
import { PublicRoute, ProtectedRoute, RoleRoute } from './RouteGuards';
import DashboardLayout from '../components/layout/DashboardLayout';

import Landing from '../features/misc/pages/Landing';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import ForgotPassword from '../features/auth/pages/ForgotPassword';
import ResetPassword from '../features/auth/pages/ResetPassword';
import Unauthorized from '../features/misc/pages/Unauthorized';
import NotFound from '../features/misc/pages/NotFound';

import ClientDashboard from '../features/client/pages/Dashboard';
import Quote from '../features/client/pages/Quote';
import Book from '../features/client/pages/Book';
import Bookings from '../features/client/pages/Bookings';
import BookingDetail from '../features/client/pages/BookingDetail';

import Settings from '../features/profile/pages/Settings';
import Notifications from '../features/notifications/pages/Notifications';
import Reviews from '../features/reviews/pages/Reviews';
import Inventory from '../features/inventory/pages/Inventory';
import Messages from '../features/messages/pages/Messages';

import MoverDashboard from '../features/mover/pages/MoverDashboard';
import MoverJobs from '../features/mover/pages/MoverJobs';
import MoverAvailability from '../features/mover/pages/MoverAvailability';

import AdminDashboard from '../features/admin/pages/AdminDashboard';
import AdminUsers from '../features/admin/pages/AdminUsers';
import AdminMovers from '../features/admin/pages/AdminMovers';

import MoverList from '../features/movers/pages/MoverList';

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
    ],
  },
  { path: '/unauthorized', element: <Unauthorized /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute roles={['client']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/client/dashboard', element: <ClientDashboard /> },
              { path: '/client/quote', element: <Quote /> },
              { path: '/client/book', element: <Book /> },
              { path: '/client/bookings', element: <Bookings /> },
              { path: '/client/bookings/:id', element: <BookingDetail /> },
            ],
          },
        ],
      },
      {
        element: <RoleRoute roles={['mover']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/mover/dashboard', element: <MoverDashboard /> },
              { path: '/mover/jobs', element: <MoverJobs /> },
              { path: '/mover/availability', element: <MoverAvailability /> },
            ],
          },
        ],
      },
      {
        element: <RoleRoute roles={['admin']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/admin/dashboard', element: <AdminDashboard /> },
              { path: '/admin/users', element: <AdminUsers /> },
              { path: '/admin/movers', element: <AdminMovers /> },
              { path: '/admin/reports', element: <AdminDashboard /> },
            ],
          },
        ],
      },
      {
        element: <RoleRoute roles={['client', 'mover', 'admin']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/profile', element: <Settings /> },
              { path: '/notifications', element: <Notifications /> },
              { path: '/reviews', element: <Reviews /> },
              { path: '/inventory', element: <Inventory /> },
              { path: '/messages', element: <Messages /> },
              { path: '/movers', element: <MoverList /> },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <NotFound /> },
]);
