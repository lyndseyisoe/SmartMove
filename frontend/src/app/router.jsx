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
import Messages from '../features/client/pages/Messages';
import Movers from '../features/client/pages/Movers';
import MoverProfile from '../features/client/pages/MoverProfile';
import PaymentCheckout from '../features/client/pages/PaymentCheckout';
import Tracking from '../features/client/pages/Tracking';

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
        element: <RoleRoute roles={['client', 'mover']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/client/dashboard', element: <ClientDashboard /> },
              { path: '/client/quote', element: <Quote /> },
              { path: '/client/book', element: <Book /> },
              { path: '/client/bookings', element: <Bookings /> },
              { path: '/client/bookings/:id', element: <BookingDetail /> },
              { path: '/client/messages', element: <Messages /> },
              { path: '/client/movers', element: <Movers /> },
              { path: '/mover/profile', element: <MoverProfile /> },
              { path: '/client/bookings/:id/pay', element: <PaymentCheckout /> },
              { path: '/client/bookings/:id/tracking', element: <Tracking /> },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <NotFound /> },
]);
