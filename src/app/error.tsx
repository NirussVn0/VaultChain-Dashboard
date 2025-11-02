'use client';

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary UI for the dashboard with retry affordance.
 */
export default function ErrorBoundary({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-6 text-center">
      <div className="max-w-md space-y-3">
        <h2 className="text-3xl font-semibold text-text-primary">
          Something went wrong
        </h2>
        <p className="text-sm text-text-tertiary">
          The dashboard could not load. The incident has been logged and our
          automation is rolling back the last action.
        </p>
        {error.digest != null ? (
          <code className="block rounded-lg border border-border bg-background-surface/70 p-3 text-xs text-text-tertiary">
            Ref: {error.digest}
          </code>
        ) : null}
      </div>
      <Button onClick={reset} variant="primary" className="px-6">
        Retry
      </Button>
    </div>
  );
}
