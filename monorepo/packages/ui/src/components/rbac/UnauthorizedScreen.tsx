import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface UnauthorizedScreenProps {
  /** Override the default heading */
  title?: string;
  /** Override the default description */
  description?: string;
  /** Called when "Go Back" is clicked */
  onBack?: () => void;
  /** Called when "Go Home" is clicked */
  onHome?: () => void;
  /** Additional class names for the root element */
  className?: string;
}

/**
 * Full-screen (or container-filling) 403 error UI shown when a user
 * tries to access a route or MFE they are not authorised for.
 *
 * @example
 * // In a RoleGuard or PermissionGate fallback:
 * <UnauthorizedScreen onHome={() => navigate('/')} />
 */
export function UnauthorizedScreen({
  title = 'Access Denied',
  description = "You don't have permission to view this page. Contact your administrator if you believe this is a mistake.",
  onBack,
  onHome,
  className,
}: UnauthorizedScreenProps) {
  return (
    <div
      className={cn(
        'flex min-h-[500px] w-full items-center justify-center p-8',
        className
      )}
    >
      <div className="flex max-w-lg flex-col items-center gap-8 text-center">
        {/* Icon badge */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-destructive/10 animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-destructive/30 bg-destructive/10">
            <ShieldX className="h-10 w-10 text-destructive" strokeWidth={1.5} />
          </div>
        </div>

        {/* Status code + text */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-destructive/70">
            403 Forbidden
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Actions */}
        {(onBack || onHome) && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            )}
            {onHome && (
              <button
                onClick={onHome}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Home className="h-4 w-4" />
                Go Home
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
