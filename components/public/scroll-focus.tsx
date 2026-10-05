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
  /** Mouse only: the card tilts toward the cursor and a gold spotlight follows it. */
  tilt?: boolean;
}

/**
 * Wrapper that sets data-focused while it is in the middle of the screen (touch only).
 * Style it with `data-[focused=true]:` and style children with `group-data-[focused=true]:`.
 */
export function ScrollFocus({ children, className, tilt = false }: ScrollFocusProps) {
  const { ref, focused } = useScrollFocus<HTMLDivElement>();

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!tilt || event.pointerType !== "mouse") return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    element.style.setProperty("--mx", `${x * 100}%`);
    element.style.setProperty("--my", `${y * 100}%`);
    element.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    element.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  }

  return (
    <div
      ref={ref}
      data-focused={focused}
      onPointerMove={tilt ? handlePointerMove : undefined}
      onPointerLeave={tilt ? handlePointerLeave : undefined}
      className={cn(
        "group relative",
        tilt && "[transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]",
        className
      )}
    >
      {tilt && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-data-[focused=true]:opacity-100 [background:radial-gradient(360px_circle_at_var(--mx,50%)_var(--my,50%),rgba(239,177,31,0.2),transparent_45%)]"
        />
      )}
      {children}
    </div>
  );
}
