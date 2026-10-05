"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Phones have no hover, so cards that "light up" on hover on desktop light up
 * on touch devices while they are near the middle of the screen instead.
 * Does nothing on devices that can hover.
 */
export function useScrollFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.matchMedia("(hover: none)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFocused(entry.isIntersecting),
      { rootMargin: "-38% 0px -38% 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, focused };
}

interface ScrollFocusProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper that sets data-focused while it is in the middle of the screen (touch only).
 * Style it with `data-[focused=true]:` and style children with `group-data-[focused=true]:`.
 */
export function ScrollFocus({ children, className }: ScrollFocusProps) {
  const { ref, focused } = useScrollFocus<HTMLDivElement>();

  return (
    <div ref={ref} data-focused={focused} className={cn("group", className)}>
      {children}
    </div>
  );
}
