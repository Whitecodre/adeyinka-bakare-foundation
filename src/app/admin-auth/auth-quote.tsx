"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { mission, vision } from "@/config/about";
import { cn } from "@/lib/utils";

/** Source: ABF constitution, Article 2 (Vision and Mission), via config/about.ts. */
const quotes = [
  { label: "Our vision", text: vision },
  ...mission.map(({ title, description }) => ({ label: title, text: description })),
];

const INTERVAL_MS = 7000;

/** Rotates the Fellowship's vision and mission on the sign-in brand panel. The first one is in the server HTML. */
export function AuthQuote() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % quotes.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  const quote = quotes[index];

  return (
    <div>
      <div aria-hidden className="font-[family-name:var(--font-display)] text-7xl leading-none text-gold-300/60">
        &ldquo;
      </div>

      <div className="min-h-[18rem] xl:min-h-[20rem]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote
              className={cn(
                "font-[family-name:var(--font-display)] font-bold leading-snug text-white",
                quote.text.length > 150 ? "text-xl xl:text-2xl" : "text-3xl xl:text-4xl"
              )}
            >
              {quote.text}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-gold-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                {quote.label}
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-2" role="group" aria-label="Choose a statement">
        {quotes.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show: ${item.label}`}
            aria-current={i === index}
            className="flex h-6 items-center"
          >
            <span
              className={cn(
                "block h-1.5 rounded-full transition-all duration-500",
                i === index ? "w-8 bg-gold-300" : "w-3 bg-white/30 hover:bg-white/50"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
