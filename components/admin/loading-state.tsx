import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  message?: string;
}

/** Full-page loading indicator. For lists, prefer ListSkeleton. */
export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="size-9 animate-spin text-primary" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

interface ListSkeletonProps {
  rows?: number;
}

/** Placeholder rows shaped like ListRow, shown while a list loads. */
export function ListSkeleton({ rows = 4 }: ListSkeletonProps) {
  return (
    <div role="status" aria-label="Loading" className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="hidden h-9 w-24 sm:block" />
        </div>
      ))}
    </div>
  );
}
