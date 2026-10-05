import { Star } from "lucide-react";

interface MarqueeProps {
  items: readonly string[];
}

/** Decorative scrolling strip. Hidden from screen readers; the same words appear elsewhere on the page. */
export function Marquee({ items }: MarqueeProps) {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <span key={item} className="flex items-center gap-10 whitespace-nowrap font-display text-lg font-bold text-maroon-600">
          {item}
          <Star className="size-4 text-gold-500" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden
      className="overflow-hidden border-y bg-white py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
    >
      <div className="abf-marquee flex w-max hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </div>
  );
}
