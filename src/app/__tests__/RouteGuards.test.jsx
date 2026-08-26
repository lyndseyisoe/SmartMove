import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../test/testUtils';
import { ProtectedRoute, RoleRoute } from '../RouteGuards';

function ProbeRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<div>Login page</div>} />
      <Route path="/unauthorized" element={<div>Unauthorized page</div>} />
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute roles={['client']} />}>
          <Route path="/client/dashboard" element={<div>Client dashboard</div>} />
        </Route>
        <Route element={<RoleRoute roles={['admin']} />}>
          <Route path="/admin/dashboard" element={<div>Admin dashboard</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

describe('Route guards', () => {
  it('redirects an unauthenticated visitor to /login', () => {
    renderWithProviders(<ProbeRoutes />, {
      route: '/client/dashboard',
      preloadedState: { auth: { isAuthenticated: false, loading: false, user: null } },
    });
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('lets an authenticated client reach the client dashboard', () => {
    renderWithProviders(<ProbeRoutes />, {
      route: '/client/dashboard',
      preloadedState: {
        auth: { isAuthenticated: true, loading: false, user: { id: '1', role: 'client' } },
      },
    });
    expect(screen.getByText('Client dashboard')).toBeInTheDocument();
  });

  it('sends a client trying to reach the admin dashboard to /unauthorized', () => {
    renderWithProviders(<ProbeRoutes />, {
      route: '/admin/dashboard',
      preloadedState: {
        auth: { isAuthenticated: true, loading: false, user: { id: '1', role: 'client' } },
      },
    });
    expect(screen.getByText('Unauthorized page')).toBeInTheDocument();
  });
});
