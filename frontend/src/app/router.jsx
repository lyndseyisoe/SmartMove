import { createBrowserRouter } from 'react-router-dom';
import { PublicRoute, ProtectedRoute, RoleRoute } from './RouteGuards';
import DashboardLayout from '../components/layout/DashboardLayout';

import Landing from '../features/misc/pages/Landing';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Unauthorized from '../features/misc/pages/Unauthorized';
import NotFound from '../features/misc/pages/NotFound';

import ClientDashboard from '../features/client/pages/Dashboard';
import Quote from '../features/client/pages/Quote';
import Book from '../features/client/pages/Book';
import Bookings from '../features/client/pages/Bookings';
import BookingDetail from '../features/client/pages/BookingDetail';

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
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
    ],
  },

  { path: '*', element: <NotFound /> },
]);
