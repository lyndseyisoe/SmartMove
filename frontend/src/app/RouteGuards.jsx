import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LoadingState } from '../components/ui';

export function PublicRoute() {
  const { isAuthenticated, loading } = useSelector((s) => s.auth);

  if (loading) return <LoadingState label="Loading SmartMove..." />;
  if (isAuthenticated) return <Navigate to="/client/dashboard" replace />;
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

  if (!roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}
