import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/** Shown when a list or page fails to load. */
export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center px-4 py-12 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" className="h-11 px-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
