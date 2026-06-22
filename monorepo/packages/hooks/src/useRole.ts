import { useAuthStore } from '@repo/store/authStore';
import type { Role } from '@repo/store/auth.types';

/**
 * Returns the current user's role, or `undefined` if not authenticated.
 *
 * @example
 * const role = useRole();
 * if (role === 'admin') { ... }
 */
export function useRole(): Role | undefined {
  return useAuthStore((s) => s.user?.role);
}

/**
 * Returns `true` if the current user has the specified role.
 *
 * @example
 * const isAdmin = useIsRole('admin');
 */
export function useIsRole(role: Role): boolean {
  return useAuthStore((s) => s.hasRole(role));
}
