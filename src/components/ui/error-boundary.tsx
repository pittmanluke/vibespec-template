"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  /**
   * The children to render
   */
  children: ReactNode;
  /**
   * Optional fallback UI to render when an error occurs
   */
  fallback?: ReactNode;
  /**
   * Whether to report errors to an error tracking service
   */
  reportErrors?: boolean;
  /**
   * Whether to show a toast notification when an error occurs
   */
  showToast?: boolean;
  /**
   * Optional component ID for error tracking
   */
  componentId?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches JavaScript errors in children components
 * and displays a fallback UI instead of crashing the whole application
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // Report to error tracking service if enabled
    if (this.props.reportErrors) {
      // In a real app, we would send to an error tracking service like Sentry
      console.log("Reporting error to tracking service:", {
        error,
        errorInfo,
        componentId: this.props.componentId
      });
    }

    // Show toast notification if enabled
    if (this.props.showToast) {
      // Since we can't use hooks in class components, we need to handle this differently
      // One approach is to have a global toast function, but for now we'll just log
      console.log("Would show toast:", {
        title: "Something went wrong",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { children, fallback } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      // Render custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div className="p-6 border rounded-md bg-destructive/10 text-center">
          <AlertCircle className="w-10 h-10 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error?.message || "An unexpected error occurred"}
          </p>
          <Button onClick={this.handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>
      );
    }

    return children;
  }
}

/**
 * Default export for convenience
 */
export default ErrorBoundary; 