import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser, Permission, Role } from './auth.types';
import { getPermissionsForRole } from './rbac';

// ─── State Shape ──────────────────────────────────────────────────────────────

interface AuthState {
  /** Currently authenticated user, null if not logged in */
  user: AuthUser | null;
  /** JWT / session token */
  token: string | null;
  /** Convenient boolean — derived from user !== null */
  isAuthenticated: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

interface AuthActions {
  /**
   * Call after a successful login / token refresh.
   * If the user object doesn't include `permissions`, they are derived
   * from the `role` using the client-side ROLE_PERMISSIONS map.
   */
  setAuth: (user: Omit<AuthUser, 'permissions'> & { permissions?: Permission[] }, token: string) => void;

  /** Clear session state (call on logout or 401 responses) */
  logout: () => void;

  /**
   * Returns true if the current user has ALL of the listed permissions.
   *
   * @example
   * const canDelete = useAuthStore(s => s.hasPermission('users:delete'));
   */
  hasPermission: (...permissions: Permission[]) => boolean;

  /**
   * Returns true if the current user has at least ONE of the listed permissions.
   */
  hasAnyPermission: (...permissions: Permission[]) => boolean;

  /**
   * Returns true if the current user has the given role.
   *
   * @example
   * const isAdmin = useAuthStore(s => s.hasRole('admin'));
   */
  hasRole: (role: Role) => boolean;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // ── Initial state
      user: null,
      token: null,
      isAuthenticated: false,

      // ── Actions
      setAuth: (rawUser, token) => {
        const permissions =
          rawUser.permissions ?? getPermissionsForRole(rawUser.role);

        const user: AuthUser = {
          ...rawUser,
          permissions,
          authenticatedAt: new Date().toISOString(),
        };

        set({ user, token, isAuthenticated: true });
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      hasPermission: (...permissions) => {
        const { user } = get();
        if (!user) return false;
        return permissions.every((p) => user.permissions.includes(p));
      },

      hasAnyPermission: (...permissions) => {
        const { user } = get();
        if (!user) return false;
        return permissions.some((p) => user.permissions.includes(p));
      },

      hasRole: (role) => get().user?.role === role,
    }),
    {
      name: 'rbac-auth-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist the minimal fields — actions are never serialised
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
