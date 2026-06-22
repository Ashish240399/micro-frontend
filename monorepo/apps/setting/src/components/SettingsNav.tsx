import { NavLink } from 'react-router-dom';
import { cn } from '@repo/ui/lib/utils';

const settingsNav = [
  { to: '/settings', label: 'General', end: true as const },
  { to: '/settings/profile', label: 'Profile', end: false as const },
  { to: '/settings/security', label: 'Security', end: false as const },
  { to: '/settings/notifications', label: 'Notifications', end: false as const },
];

export function SettingsNav() {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-border pb-4">
      {settingsNav.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
