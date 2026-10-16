"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface SectionDotsProps {
  sections: { id: string; label: string }[];
}

/** Dots on the right edge that show which section you are in and jump to it. Wide screens only. */
export function SectionDots({ sections }: SectionDotsProps) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Page sections" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={label}
          aria-current={active === id ? "true" : undefined}
          className="group relative flex size-4 items-center justify-center"
        >
          <span
            className={cn(
              "size-2.5 rounded-full transition-all duration-300",
              active === id ? "scale-150 bg-primary" : "bg-maroon-200 group-hover:bg-maroon-400"
            )}
          />
          <span className="pointer-events-none absolute right-6 translate-x-2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-xs font-bold text-white opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
            {label}
          </span>
        </a>
      ))}
    </nav>
  );
}
