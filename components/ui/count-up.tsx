"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Counts up from 0 when it scrolls into view. The final value is in the HTML from the start. */
export function CountUp({ value }: { value: string | number }) {
  const text = String(value);
  const match = text.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!inView || reduceMotion || !match) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion, target]);

  if (!match) return <span>{text}</span>;

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
