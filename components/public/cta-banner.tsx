import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/public/section";
import { Magnetic } from "@/components/public/magnetic";
import { Reveal } from "@/components/public/reveal";

interface CTALink {
  label: string;
  href: string;
}

interface CTABannerProps {
  title: string;
  description?: string;
  primary: CTALink;
  secondary?: CTALink;
}

/** The maroon "ready to join?" band used at the bottom of inner pages. */
export function CTABanner({ title, description, primary, secondary }: CTABannerProps) {
  return (
    <Section tone="dark" width="prose">
      <div
        aria-hidden
        className="abf-float absolute -right-16 -top-16 size-64 rounded-full bg-gold-300/25 blur-3xl"
      />
      <div
        aria-hidden
        className="abf-float absolute -bottom-20 -left-16 size-64 rounded-full bg-maroon-300/25 blur-3xl"
      />
      <Reveal className="relative text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">{title}</h2>
        {description && <p className="mt-4 text-lg text-maroon-100 md:text-xl">{description}</p>}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Magnetic className="block sm:inline-block">
            <Button asChild size="lg" className="h-12 w-full bg-white px-8 text-primary shadow-xl hover:bg-white/90 sm:w-auto">
              <Link href={primary.href}>
                {primary.label}
                <ArrowRight />
              </Link>
            </Button>
          </Magnetic>
          {secondary && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full border-2 border-white bg-transparent px-8 text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
