import type { ReactNode } from 'react';
import { usePermission, useAnyPermission } from '@repo/hooks/usePermission';
import type { Permission } from '@repo/store/auth.types';

interface PermissionGateProps {
  /**
   * The permission(s) required to see the children.
   * When an array is passed, the user must have ALL permissions (AND logic).
   * Use `requireAny` prop if you need OR logic.
   */
  requires: Permission | Permission[];

  /**
   * If true, the user only needs ANY ONE of the listed permissions (OR logic).
   * Ignored when `requires` is a single string.
   * @default false
   */
  requireAny?: boolean;

  /**
   * Rendered when the user does NOT have the required permissions.
   * Defaults to `null` (renders nothing).
   */
  fallback?: ReactNode;

  children: ReactNode;
}

/**
 * Conditionally renders `children` based on the current user's permissions.
 * Reads from the shared Zustand auth store — works across all MFEs since
 * `@repo/store` is declared as a Module Federation singleton.
 *
 * @example
 * // Hide a button from users without write access
 * <PermissionGate requires="tasks:write">
 *   <EditButton />
 * </PermissionGate>
 *
 * @example
 * // Show a read-only fallback for users without write access
 * <PermissionGate requires="users:write" fallback={<ReadOnlyView />}>
 *   <EditForm />
 * </PermissionGate>
 *
 * @example
 * // OR logic — user needs at least one of the permissions
 * <PermissionGate requires={['tasks:read', 'tasks:write']} requireAny>
 *   <TaskPanel />
 * </PermissionGate>
 */
export function PermissionGate({
  requires,
  requireAny = false,
  fallback = null,
  children,
}: PermissionGateProps) {
  const perms = Array.isArray(requires) ? requires : [requires];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const allowed = requireAny
    ? useAnyPermission(...perms)
    : usePermission(...perms);

  return allowed ? <>{children}</> : <>{fallback}</>;
}
