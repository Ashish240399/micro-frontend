import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@repo/store/authStore';
import type { Role } from '@repo/store/auth.types';

interface RoleGuardProps {
  /** The user must have at least one of these roles to proceed */
  allowedRoles: Role[];
  /**
   * Where to redirect if the role check fails.
   * Defaults to `/unauthorized`.
   */
  redirectTo?: string;
}

/**
 * Route guard that blocks users whose role is not in `allowedRoles`.
 * Must be placed inside an `<AuthGuard>` in the route tree so that
 * unauthenticated users are always redirected to login first.
 *
 * @example
 * // Only admins and managers can access /management
 * <Route element={<RoleGuard allowedRoles={['admin', 'manager']} />}>
 *   <Route path="/management/*" element={<ManagementApp />} />
 * </Route>
 */
export function RoleGuard({ allowedRoles, redirectTo = '/unauthorized' }: RoleGuardProps) {
  const role = useAuthStore((s) => s.user?.role);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
