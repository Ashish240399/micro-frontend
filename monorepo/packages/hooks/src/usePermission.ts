import { useAuthStore } from '@repo/store/authStore';
import type { Permission } from '@repo/store/auth.types';

/**
 * Returns `true` if the current user has ALL of the listed permissions.
 * Subscribes to the auth store — re-renders automatically on auth changes.
 *
 * @example
 * // Single permission
 * const canWrite = usePermission('tasks:write');
 *
 * // Multiple permissions (AND logic — user must have all)
 * const canManage = usePermission('users:write', 'users:delete');
 */
export function usePermission(...permissions: Permission[]): boolean {
  return useAuthStore((s) =>
    permissions.length === 0 ? true : s.hasPermission(...permissions)
  );
}

/**
 * Returns `true` if the current user has AT LEAST ONE of the listed permissions.
 *
 * @example
 * const canReadOrWrite = useAnyPermission('tasks:read', 'tasks:write');
 */
export function useAnyPermission(...permissions: Permission[]): boolean {
  return useAuthStore((s) =>
    permissions.length === 0 ? true : s.hasAnyPermission(...permissions)
  );
}
