import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LoadingState } from '../components/ui';

function dashboardPathFor(role) {
  if (role === 'mover') return '/mover/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/client/dashboard';
}

export function PublicRoute() {
  const { isAuthenticated, loading, user } = useSelector((s) => s.auth);

  if (loading) return <LoadingState label="Loading SmartMove..." />;
  if (isAuthenticated) return <Navigate to={dashboardPathFor(user?.role)} replace />;
  return <Outlet />;
}

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useSelector((s) => s.auth);
  const location = useLocation();

  if (loading) return <LoadingState label="Loading SmartMove..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

export function RoleRoute({ roles }) {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  if (
    user?.role === 'mover' &&
    user?.moverStatus === 'pending' &&
    !location.pathname.startsWith('/mover/pending')
  ) {
    return <Navigate to="/mover/pending" replace />;
  }
  return <Outlet />;
}
