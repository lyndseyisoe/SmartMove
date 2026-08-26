import { createBrowserRouter } from 'react-router-dom';
import { PublicRoute, ProtectedRoute, RoleRoute } from './RouteGuards';
import DashboardLayout from '../components/layout/DashboardLayout';

import Landing from '../features/misc/pages/Landing';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import RegisterMover from '../features/auth/pages/RegisterMover';
import ForgotPassword from '../features/auth/pages/ForgotPassword';
import ResetPassword from '../features/auth/pages/ResetPassword';
import Unauthorized from '../features/misc/pages/Unauthorized';
import NotFound from '../features/misc/pages/NotFound';

import ClientDashboard from '../features/client/pages/Dashboard';
import Inventory from '../features/client/pages/Inventory';
import Quote from '../features/client/pages/Quote';
import Book from '../features/client/pages/Book';
import Bookings from '../features/client/pages/Bookings';
import BookingDetail from '../features/client/pages/BookingDetail';
import Track from '../features/client/pages/Track';
import Reviews from '../features/client/pages/Reviews';

import MoverPending from '../features/mover/pages/Pending';
import MoverDashboard from '../features/mover/pages/Dashboard';
import Jobs from '../features/mover/pages/Jobs';
import JobDetail from '../features/mover/pages/JobDetail';
import Availability from '../features/mover/pages/Availability';

import AdminDashboard from '../features/admin/pages/Dashboard';
import Users from '../features/admin/pages/Users';
import Movers from '../features/admin/pages/Movers';
import AdminBookings from '../features/admin/pages/Bookings';
import AdminReviews from '../features/admin/pages/Reviews';
import Reports from '../features/admin/pages/Reports';

import Messages from '../features/messages/pages/Messages';
import Notifications from '../features/notifications/pages/Notifications';
import Profile from '../features/profile/pages/Profile';

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/register/mover', element: <RegisterMover /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
    ],
  },
  { path: '/unauthorized', element: <Unauthorized /> },

  {
    element: <ProtectedRoute />,
    children: [
      // Mover pending-approval screen sits outside DashboardLayout (no sidebar yet).
      { path: '/mover/pending', element: <MoverPending /> },

      {
        element: <RoleRoute roles={['client']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/client/dashboard', element: <ClientDashboard /> },
              { path: '/client/inventory', element: <Inventory /> },
              { path: '/client/quote', element: <Quote /> },
              { path: '/client/book', element: <Book /> },
              { path: '/client/bookings', element: <Bookings /> },
              { path: '/client/bookings/:id', element: <BookingDetail /> },
              { path: '/client/track/:id', element: <Track /> },
              { path: '/client/messages', element: <Messages /> },
              { path: '/client/reviews', element: <Reviews /> },
              { path: '/client/notifications', element: <Notifications /> },
              { path: '/client/profile', element: <Profile /> },
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
              { path: '/mover/jobs', element: <Jobs /> },
              { path: '/mover/jobs/:id', element: <JobDetail /> },
              { path: '/mover/availability', element: <Availability /> },
              { path: '/mover/messages', element: <Messages /> },
              { path: '/mover/notifications', element: <Notifications /> },
              { path: '/mover/profile', element: <Profile /> },
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
              { path: '/admin/users', element: <Users /> },
              { path: '/admin/movers', element: <Movers /> },
              { path: '/admin/bookings', element: <AdminBookings /> },
              { path: '/admin/reviews', element: <AdminReviews /> },
              { path: '/admin/reports', element: <Reports /> },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <NotFound /> },
]);
