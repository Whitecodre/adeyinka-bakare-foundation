import { cn } from "@/lib/utils";
import { ScrollFocus } from "@/components/public/scroll-focus";

interface IconTileProps {
  children: React.ReactNode;
  className?: string;
}

/** The maroon gradient square that holds an icon. Pass a lucide icon as children. */
export function IconTile({ children, className }: IconTileProps) {
  return (
    <div
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-maroon-500 to-maroon-600 text-white shadow-lg shadow-maroon-500/30 transition-transform duration-500 [&_svg]:size-6",
        className
      )}
    >
      {children}
    </div>
  );
}

/*
 * Interaction on every card:
 *  - mouse:  hover lifts the card and spins the icon
 *  - touch:  the same effect plays while the card is near the middle of the screen (ScrollFocus)
 *  - press:  active:* gives instant feedback on both
 */
const cardMotion =
  "h-full rounded-2xl border bg-card shadow-sm transition-all duration-500 active:scale-[0.98] hover:-translate-y-1.5 hover:border-maroon-200 hover:shadow-xl hover:shadow-maroon-700/15 data-[focused=true]:-translate-y-1.5 data-[focused=true]:border-maroon-200 data-[focused=true]:shadow-xl data-[focused=true]:shadow-maroon-700/15";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <ScrollFocus tilt className={cn(cardMotion, "p-6", className)}>
      <IconTile className="mb-4 group-hover:-rotate-6 group-hover:scale-110 group-data-[focused=true]:-rotate-6 group-data-[focused=true]:scale-110">
        {icon}
      </IconTile>
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </ScrollFocus>
  );
}

interface NumberedItemProps {
  number: number;
  title: string;
  className?: string;
}

export function NumberedItem({ number, title, className }: NumberedItemProps) {
  return (
    <ScrollFocus tilt className={cn(cardMotion, "p-6", className)}>
      <div className="mb-4 flex size-11 items-center justify-center rounded-full border border-maroon-200 bg-maroon-50 font-display text-lg font-bold text-maroon-600 transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-data-[focused=true]:rotate-[360deg] group-data-[focused=true]:scale-110 group-data-[focused=true]:bg-primary group-data-[focused=true]:text-primary-foreground">
        {number}
      </div>
      <h3 className="text-lg font-semibold leading-snug text-foreground">{title}</h3>
    </ScrollFocus>
  );
}
