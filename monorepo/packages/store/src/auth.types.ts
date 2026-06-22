/**
 * Coarse-grained roles assigned to a user.
 * Used for route-level access control in the shell.
 */
export type Role = 'admin' | 'manager' | 'viewer';

/**
 * Fine-grained permissions used for component-level access control.
 * Format: `resource:action`
 */
export type Permission =
  | 'dashboard:view'
  | 'tasks:read'
  | 'tasks:write'
  | 'tasks:delete'
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'settings:manage'
  | 'management:access';

/**
 * Authenticated user shape returned from the backend / decoded from JWT.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Fine-grained permissions — ideally server-issued via JWT claims */
  permissions: Permission[];
  /** ISO 8601 timestamp when the user was last authenticated */
  authenticatedAt?: string;
}
