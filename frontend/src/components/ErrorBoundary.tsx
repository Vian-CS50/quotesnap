"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  section?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`ErrorBoundary${this.props.section ? ` [${this.props.section}]` : ""}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="py-20 px-4 text-center" style={{ backgroundColor: "var(--background)" }}>
          <div className="max-w-md mx-auto space-y-4">
            <h3 className="font-serif text-2xl" style={{ color: "var(--foreground)" }}>
              Something went wrong
            </h3>
            <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
              {this.props.section
                ? `The ${this.props.section} section failed to load.`
                : "This section failed to load."}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="h-10 px-6 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
              style={{ backgroundColor: "var(--primary)", color: "white", borderRadius: "0px" }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
