"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

interface ListRowProps {
  /** Avatar, initials or icon tile shown on the left. */
  leading?: React.ReactNode;
  title: React.ReactNode;
  /** Badges shown beside the title. */
  badges?: React.ReactNode;
  /** Secondary lines: email, dates, counts. */
  meta?: React.ReactNode;
  /** Switches and RowActions, shown on the right (below on phones). */
  actions?: React.ReactNode;
  /** Position in the list; drives the staggered entrance (first 10 only). */
  index?: number;
  className?: string;
}

/** The standard record card for admin lists: who/what, status, and actions. */
export function ListRow({ leading, title, badges, meta, actions, index = 0, className }: ListRowProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, delay: Math.min(index, 10) * 0.04 }}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:gap-4",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {leading}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-foreground">{title}</h3>
            {badges}
          </div>
          {meta && <div className="space-y-0.5 text-sm text-muted-foreground">{meta}</div>}
        </div>
      </div>
      {actions && (
        <div className="flex items-center justify-end gap-2 border-t border-border pt-3 sm:border-0 sm:pt-0">
          {actions}
        </div>
      )}
    </motion.div>
  );
}
