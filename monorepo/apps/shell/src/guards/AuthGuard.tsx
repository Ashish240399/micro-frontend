import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@repo/store/authStore';

/**
 * Route guard that redirects unauthenticated users to `/login`.
 * Preserves the originally requested URL so users land in the right place
 * after logging in via the `state.from` location.
 *
 * Usage: Wrap any `<Route>` that requires authentication:
 * @example
 * <Route element={<AuthGuard />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 */
export function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Pass the current location so the login page can redirect back after auth
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
