"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "maroon" | "gold";
  change?: string;
  trend?: "up" | "down";
  className?: string;
}

const tones = {
  maroon: "bg-primary/10 text-primary group-hover:bg-primary/15",
  gold: "bg-secondary/25 text-gold-700 group-hover:bg-secondary/35",
} as const;

/** One headline number with an icon. Lifts slightly on hover. */
export function DashboardCard({
  title,
  value,
  icon: Icon,
  color = "maroon",
  change,
  trend,
  className,
}: DashboardCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-lg md:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-sm font-medium text-muted-foreground">{title}</p>
          <p className="truncate text-3xl font-bold text-foreground transition-colors group-hover:text-primary">
            <CountUp value={value} />
          </p>
          {change && trend && (
            <p className={cn("mt-2 text-sm font-medium", trend === "up" ? "text-success" : "text-destructive")}>
              {change} from last month
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors",
            tones[color],
          )}
        >
          <Icon className="size-6" />
        </div>
      </div>
    </motion.div>
  );
}
