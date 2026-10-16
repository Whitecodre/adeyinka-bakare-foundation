import { cn } from "@/lib/utils";

type SectionTone = "default" | "tint" | "dark";

interface SectionProps {
  tone?: SectionTone;
  width?: "wide" | "prose";
  id?: string;
  className?: string;
  children: React.ReactNode;
}

const toneClasses: Record<SectionTone, string> = {
  default: "",
  tint: "bg-gradient-to-b from-maroon-50 to-cream",
  dark: "relative overflow-hidden bg-gradient-to-r from-maroon-500 via-maroon-600 to-maroon-700 text-white",
};

export function Section({
  tone = "default",
  width = "wide",
  id,
  className,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24", toneClasses[tone], className)}>
      <div
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          width === "wide" ? "max-w-7xl" : "max-w-3xl"
        )}
      >
        {children}
      </div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "default" | "inverse";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "default",
  className,
}: SectionHeadingProps) {
  const inverse = tone === "inverse";

  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.2em]",
            inverse ? "text-gold-300" : "text-primary"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-bold md:text-4xl",
          inverse ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg md:text-xl",
            inverse ? "text-maroon-100" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
