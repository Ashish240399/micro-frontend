import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface ErrorProps {
  /** Main heading shown in the error card */
  title?: string;
  /** Descriptive message below the heading */
  message?: string;
  /** Called when the user clicks "Try Again" — omit to hide the button */
  onRetry?: () => void;
  /** Called when the user clicks "Go Home" — omit to hide the button */
  onHome?: () => void;
  /** Extra classes applied to the root wrapper */
  className?: string;
}

const Error = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again or return to the home page.",
  onRetry,
  onHome,
  className,
}: ErrorProps) => {
  return (
    <div
      className={cn(
        "flex min-h-[400px] w-full items-center justify-center p-6",
        className,
      )}
    >
      <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-destructive/20 bg-card p-10 text-center shadow-lg">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" strokeWidth={1.5} />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
        </div>

        {/* Actions */}
        {(onRetry || onHome) && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onRetry && (
              <Button onClick={onRetry} variant="default" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            {onHome && (
              <Button onClick={onHome} variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Error;