import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export default function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'SELLER') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}