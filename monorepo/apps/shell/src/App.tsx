import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Settings,
  Briefcase,
  LogOut,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { AuthGuard } from './guards/AuthGuard';
import { RoleGuard } from './guards/RoleGuard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from '@repo/hooks/useAuth';
import { useRole } from '@repo/hooks/useRole';
import { useAuthStore } from '@repo/store/authStore';
import type { Role } from '@repo/store/auth.types';
import { UnauthorizedScreen } from '@repo/ui/components/rbac/UnauthorizedScreen';

// ─── Remote MFEs (lazy loaded via Module Federation) ─────────────────────────
const DashboardApp  = lazy(() => import('dashboard/App'));
const ManagementApp = lazy(() => import('management/App'));
const TaskApp       = lazy(() => import('task/App'));
const UserApp       = lazy(() => import('user/App'));
const SettingApp    = lazy(() => import('setting/App'));

// ─── Loading Spinner ──────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

// ─── Login Page (embedded — replace with auth MFE when connected) ─────────────
function LoginPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDemoLogin = (role: Role) => {
    setAuth(
      { id: `${role}-1`, name: `Demo ${role}`, email: `${role}@demo.com`, role },
      'demo-jwt-token'
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck className="h-7 w-7 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-4">
          <p className="text-center text-sm text-muted-foreground font-medium">Demo logins</p>
          {(['admin', 'manager', 'viewer'] as const).map((role) => (
            <button
              key={role}
              id={`login-${role}`}
              onClick={() => handleDemoLogin(role)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-accent"
            >
              <span className="font-semibold capitalize text-foreground">{role}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                — {role === 'admin' ? 'Full access' : role === 'manager' ? 'Read + write tasks & users' : 'Read-only'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
const navItems = [
  { to: '/dashboard',   label: 'Dashboard',  icon: LayoutDashboard, roles: ['admin', 'manager', 'viewer'] },
  { to: '/tasks',       label: 'Tasks',       icon: CheckSquare,     roles: ['admin', 'manager', 'viewer'] },
  { to: '/management',  label: 'Management',  icon: Briefcase,       roles: ['admin', 'manager'] },
  { to: '/users',       label: 'Users',       icon: Users,           roles: ['admin', 'manager', 'viewer'] },
  { to: '/settings',    label: 'Settings',    icon: Settings,        roles: ['admin'] },
] as const;

function Sidebar() {
  const { user, logout } = useAuth();
  const role = useRole();

  const visibleItems = navItems.filter((item) =>
    role ? (item.roles as readonly string[]).includes(role) : false
  );

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-xs font-bold text-primary-foreground">MF</span>
        </div>
        <span className="font-semibold text-foreground">MicroApp</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            id={`nav-${label.toLowerCase()}`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-border p-4">
        <div className="mb-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="text-sm font-semibold text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
            {role}
          </span>
        </div>
        <button
          id="logout-button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}

// ─── Authenticated Layout ─────────────────────────────────────────────────────
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public ────────────────────────────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Protected: any authenticated user ─────────────────────────── */}
          <Route element={<AuthGuard />}>
            <Route
              path="/dashboard/*"
              element={
                <AuthenticatedLayout>
                  <ErrorBoundary key="dashboard">
                    <DashboardApp />
                  </ErrorBoundary>
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/tasks/*"
              element={
                <AuthenticatedLayout>
                  <ErrorBoundary key="tasks">
                    <TaskApp />
                  </ErrorBoundary>
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/users/*"
              element={
                <AuthenticatedLayout>
                  <ErrorBoundary key="users">
                    <UserApp />
                  </ErrorBoundary>
                </AuthenticatedLayout>
              }
            />

            {/* ── Admin + Manager only ───────────────────────────────────── */}
            <Route element={<RoleGuard allowedRoles={['admin', 'manager']} />}>
              <Route
                path="/management/*"
                element={
                  <AuthenticatedLayout>
                    <ErrorBoundary key="management">
                      <ManagementApp />
                    </ErrorBoundary>
                  </AuthenticatedLayout>
                }
              />
            </Route>

            {/* ── Admin only ────────────────────────────────────────────── */}
            <Route element={<RoleGuard allowedRoles={['admin']} />}>
              <Route
                path="/settings/*"
                element={
                  <AuthenticatedLayout>
                    <ErrorBoundary key="settings">
                      <SettingApp />
                    </ErrorBoundary>
                  </AuthenticatedLayout>
                }
              />
            </Route>

            {/* Default authenticated redirect */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* ── 403 Unauthorized ──────────────────────────────────────────── */}
          <Route
            path="/unauthorized"
            element={
              <div className="flex min-h-screen items-center justify-center bg-background">
                <UnauthorizedScreen onHome={() => window.location.assign('/dashboard')} />
              </div>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
