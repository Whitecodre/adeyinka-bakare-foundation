import { cn } from "@/lib/utils"

/** Placeholder block shown while data loads. Size it with className. */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-hidden="true"
      {...props}
    />
  )
}

export { Skeleton }
