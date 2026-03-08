import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ROLE_REDIRECTS = {
  EMPLOYEE: '/dashboard',
  MANAGER: '/manager',
  HR: '/hr',
  ADMIN: '/admin'
}

const RoleRoute = ({ allowedRoles }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_REDIRECTS[user.role] || 'login'} replace />
  }

  return <Outlet />
}

export default RoleRoute;