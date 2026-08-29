import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
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
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <div className="rounded-full bg-destructive/10 p-4 text-destructive mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            An unexpected error occurred. You can try refreshing the page or
            clearing your active filters.
          </p>
          <Button onClick={this.handleReset} className="mt-6">
            Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
