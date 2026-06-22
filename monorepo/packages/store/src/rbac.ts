import type { Role, Permission } from './auth.types';

/**
 * Default permission set per role.
 * This is the client-side fallback — your backend JWT should ideally
 * include a `permissions` claim so the server remains the source of truth.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'dashboard:view',
    'tasks:read',
    'tasks:write',
    'tasks:delete',
    'users:read',
    'users:write',
    'users:delete',
    'settings:manage',
    'management:access',
  ],
  manager: [
    'dashboard:view',
    'tasks:read',
    'tasks:write',
    'users:read',
    'management:access',
  ],
  viewer: [
    'dashboard:view',
    'tasks:read',
    'users:read',
  ],
};

/**
 * Derive the default permission set from a role.
 * Use this only when the backend does NOT return explicit permissions.
 *
 * @example
 * const perms = getPermissionsForRole('manager');
 */
export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Check whether a permission set satisfies all required permissions.
 *
 * @example
 * const ok = hasAllPermissions(['tasks:read', 'users:read'], ['tasks:read']);
 * // => true
 */
export function hasAllPermissions(
  userPermissions: Permission[],
  required: Permission[]
): boolean {
  return required.every((p) => userPermissions.includes(p));
}

/**
 * Check whether a permission set satisfies at least one required permission.
 */
export function hasAnyPermission(
  userPermissions: Permission[],
  required: Permission[]
): boolean {
  return required.some((p) => userPermissions.includes(p));
}
