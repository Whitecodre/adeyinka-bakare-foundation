import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

import { mission, vision } from "@/config/about";
import { Reveal } from "@/components/public/reveal";
import { ScrollFocus } from "@/components/public/scroll-focus";
import { Section } from "@/components/public/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* Phrases from the Vision (Article 2, Section 1) picked out in gold. The sentence itself is unchanged. */
const emphasis = ["learning and good character", "academic success", "career pursuits"];
const emphasisPattern = new RegExp(`(${emphasis.join("|")})`, "g");

function VisionText({ text }: { text: string }) {
  return (
    <>
      {text.split(emphasisPattern).map((part, index) =>
        emphasis.includes(part) ? (
          <span key={index} className="text-gold-300">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

export function MissionSection() {
  return (
    <Section className="bg-white">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Vision: pinned beside the mission list on desktop */}
        <Reveal direction="left" className="lg:sticky lg:top-28 lg:col-span-5">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-maroon-600 via-maroon-700 to-maroon-800 p-7 text-white shadow-xl shadow-maroon-800/20 sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-gold-300/20 blur-3xl"
            />
            <Quote aria-hidden className="relative mb-5 size-10 text-gold-300/80" />
            <h2 className="relative mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 font-sans">
              Our Vision
            </h2>
            <p className="relative text-xl font-medium leading-relaxed text-maroon-50 sm:text-2xl sm:leading-relaxed">
              <VisionText text={vision} />
            </p>
            <div aria-hidden className="relative mt-7 h-1 w-16 rounded-full bg-gold-300" />
          </div>
        </Reveal>

        {/* Mission */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">What we do</p>
            <h3 className="text-3xl font-bold text-foreground md:text-4xl">Our Mission</h3>
            <p className="mt-3 text-lg text-muted-foreground">ABF Fellowship shall:</p>
          </Reveal>

          <ul className="mt-7 space-y-3">
            {mission.map(({ icon: Icon, title, description }, index) => (
              <li key={title}>
                <Reveal delay={index * 0.08}>
                  <ScrollFocus
                    className={cn(
                      "flex items-start gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all duration-500 sm:items-center sm:p-5",
                      "active:scale-[0.99] hover:-translate-y-0.5 hover:border-maroon-200 hover:shadow-lg hover:shadow-maroon-700/10",
                      "data-[focused=true]:-translate-y-0.5 data-[focused=true]:border-maroon-200 data-[focused=true]:shadow-lg data-[focused=true]:shadow-maroon-700/10"
                    )}
                  >
                    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-maroon-50 text-maroon-600 transition-all duration-500 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground group-data-[focused=true]:scale-105 group-data-[focused=true]:bg-primary group-data-[focused=true]:text-primary-foreground [&_svg]:size-6">
                      <Icon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground">{title}</h4>
                      <p className="mt-0.5 text-sm text-muted-foreground sm:text-base">{description}</p>
                    </div>
                    <span
                      aria-hidden
                      className="hidden font-[family-name:var(--font-display)] text-3xl font-bold text-maroon-100 transition-colors duration-500 group-hover:text-maroon-200 sm:block"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </ScrollFocus>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={0.2} className="mt-8">
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/about">
                Learn more about ABF
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
