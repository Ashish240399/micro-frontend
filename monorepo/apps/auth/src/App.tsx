import { useState } from 'react';
import { useAuthStore } from '@repo/store/authStore';
import type { Role } from '@repo/store/auth.types';
import { LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';

// ─── Fake credential map (replace with real API call) ─────────────────────────
const DEMO_USERS: Record<string, { password: string; role: Role; name: string }> = {
  'admin@demo.com':   { password: 'admin123',   role: 'admin',   name: 'Alice Admin' },
  'manager@demo.com': { password: 'manager123', role: 'manager', name: 'Bob Manager' },
  'viewer@demo.com':  { password: 'viewer123',  role: 'viewer',  name: 'Carol Viewer' },
};

// ─── Auth MFE App ─────────────────────────────────────────────────────────────
function App() {
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate network latency
    await new Promise((r) => setTimeout(r, 600));

    const found = DEMO_USERS[email.toLowerCase().trim()];
    if (!found || found.password !== password) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    // Call setAuth — the store derives permissions from the role automatically
    setAuth(
      { id: crypto.randomUUID(), name: found.name, email: email.toLowerCase().trim(), role: found.role },
      `demo-jwt-${found.role}-${Date.now()}`
    );

    setLoading(false);
    // Shell router will redirect automatically once isAuthenticated becomes true
  };

  const quickLogin = (role: Role) => {
    const entry = Object.entries(DEMO_USERS).find(([, v]) => v.role === role);
    if (entry) {
      const [addr, { name }] = entry;
      setAuth(
        { id: crypto.randomUUID(), name, email: addr, role },
        `demo-jwt-${role}-${Date.now()}`
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <ShieldCheck className="h-7 w-7 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access the application
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="auth-password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p id="auth-error" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Quick demo logins */}
          <div className="mt-6 border-t border-border pt-6">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Quick demo access
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['admin', 'manager', 'viewer'] as const).map((role) => (
                <button
                  key={role}
                  id={`quick-login-${role}`}
                  onClick={() => quickLogin(role)}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium capitalize text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {role}
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              admin123 / manager123 / viewer123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
