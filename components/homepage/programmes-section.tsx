import { programmeLevels } from "@/config/programme-levels";
import { Reveal } from "@/components/public/reveal";
import { ScrollFocus } from "@/components/public/scroll-focus";
import { Section, SectionHeading } from "@/components/public/section";

// Badge colour per level (same order as programmeLevels).
const badgeColors = [
  "from-maroon-100 to-maroon-200",
  "from-gold-300 to-gold-200",
  "from-maroon-300 to-maroon-400",
  "from-maroon-500 to-maroon-600 text-white",
];

export function ProgrammesSection() {
  return (
    <Section tone="tint">
      <Reveal>
        <SectionHeading
          title="Our Programmes"
          description="Comprehensive support designed for every stage of your academic journey"
        />
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {programmeLevels.map(({ icon: Icon, level, title, summary }, index) => (
          <Reveal key={level} delay={index * 0.1}>
            <ScrollFocus className="flex h-full flex-col items-center rounded-2xl border bg-card p-6 text-center shadow-lg transition-all duration-500 active:scale-[0.98] hover:border-primary/30 hover:shadow-2xl data-[focused=true]:border-primary/30 data-[focused=true]:shadow-2xl">
              <span
                className={`mb-4 inline-block rounded-full bg-gradient-to-r px-3 py-1 text-sm font-semibold text-foreground ${badgeColors[index]}`}
              >
                {level}
              </span>
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-white shadow-md transition-transform duration-500 group-hover:scale-110 group-data-[focused=true]:scale-110">
                <Icon className="size-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </ScrollFocus>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
