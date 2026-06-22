import { useAuthStore } from '@repo/store/authStore';
import type { AuthUser } from '@repo/store/auth.types';

interface UseAuthReturn {
  /** The authenticated user, or null */
  user: AuthUser | null;
  /** JWT / session token */
  token: string | null;
  /** True when a user is logged in */
  isAuthenticated: boolean;
  /** Log the user out and clear persisted auth state */
  logout: () => void;
}

/**
 * High-level hook for reading auth state and triggering logout.
 * For fine-grained permission checks, prefer `usePermission` or `useRole`.
 *
 * @example
 * const { user, isAuthenticated, logout } = useAuth();
 */
export function useAuth(): UseAuthReturn {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  return { user, token, isAuthenticated, logout };
}
