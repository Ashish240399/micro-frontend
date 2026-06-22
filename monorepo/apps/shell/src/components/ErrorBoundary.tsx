import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Micro-frontend crashed:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full min-h-[300px] items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-destructive mb-2">Micro-Frontend Crashed</h2>
            <p className="text-sm text-destructive/80 mb-6">
              {this.state.error?.message || 'An unexpected error occurred while rendering this module.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
