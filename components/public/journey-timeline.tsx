"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { IconTile } from "@/components/public/feature-card";

export interface JourneyStep {
  /** Short label inside the circle, e.g. "100L". */
  short: string;
  title: string;
  summary: string;
  icon: React.ReactNode;
  heading: string;
  description: string;
  points: string[];
}

interface JourneyTimelineProps {
  steps: JourneyStep[];
}

/**
 * Stages along a line that fills as you scroll. Tapping a stage shows its details.
 * Vertical on phones, horizontal from the lg breakpoint.
 */
export function JourneyTimeline({ steps }: JourneyTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [pickedByUser, setPickedByUser] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (pickedByUser) return;
    setActive(Math.min(steps.length - 1, Math.floor(progress * steps.length * 0.999)));
  });

  const current = steps[active];

  return (
    <div>
      <div ref={containerRef} className="relative grid gap-2 lg:grid-cols-4 lg:gap-6">
        {/* Track and animated fill: vertical on phones, horizontal on lg+ */}
        <div aria-hidden className="absolute bottom-8 left-[31px] top-8 w-[3px] rounded bg-maroon-100 lg:hidden">
          <motion.div
            className="size-full origin-top rounded bg-gradient-to-b from-gold-400 to-maroon-500"
            style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
          />
        </div>
        <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-[3px] rounded bg-maroon-100 lg:block">
          <motion.div
            className="size-full origin-left rounded bg-gradient-to-r from-gold-400 to-maroon-500"
            style={{ scaleX: reduceMotion ? 1 : scrollYProgress }}
          />
        </div>

        {steps.map((step, index) => {
          const isActive = index === active;

          return (
            <button
              key={step.short}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                setPickedByUser(true);
                setActive(index);
              }}
              className="group relative grid grid-cols-[4rem_1fr] items-start gap-4 rounded-2xl py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:grid-cols-1 lg:justify-items-center lg:px-2 lg:text-center"
            >
              <span
                className={cn(
                  "relative z-10 flex size-16 items-center justify-center rounded-full border-4 text-sm font-extrabold transition-all duration-500",
                  isActive
                    ? "scale-110 border-gold-300 bg-gradient-to-br from-maroon-500 to-maroon-700 text-white shadow-[0_0_0_8px_rgba(239,177,31,0.2)]"
                    : "border-maroon-200 bg-white text-maroon-500 group-hover:border-gold-300"
                )}
              >
                {step.short}
              </span>
              <span>
                <span
                  className={cn(
                    "block font-display text-lg font-bold leading-snug transition-colors",
                    isActive ? "text-primary" : "text-foreground"
                  )}
                >
                  {step.title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{step.summary}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border bg-card p-6 shadow-lg shadow-maroon-700/5 md:p-8"
          >
            <IconTile className="mb-4">{current.icon}</IconTile>
            <h3 className="mb-2 text-xl font-semibold text-foreground md:text-2xl">{current.heading}</h3>
            <p className="mb-5 text-muted-foreground">{current.description}</p>
            <ul className="space-y-3">
              {current.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-maroon-50 text-primary">
                    <Check className="size-3.5" />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
