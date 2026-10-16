import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NumberedItem } from "@/components/public/feature-card";
import { Magnetic } from "@/components/public/magnetic";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";

// Source: constitution, Article 3.2 (eligibility) and Article 5 (programmes by level).
const steps = [
  "Be a registered student of the University of Ilorin in the Department of Information Technology",
  "Register with the Fellowship through the Fellowship registration link",
  "Take part in the programme for your level, from scholarships to mentorship",
];

export function HowToJoinSection() {
  return (
    <Section className="bg-white">
      <Reveal>
        <SectionHeading
          eyebrow="Get involved"
          title="How to join ABF"
          description="Three simple steps to become part of the fellowship."
        />
      </Reveal>
      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3 md:gap-6">
        {steps.map((step, index) => (
          <Reveal key={step} delay={index * 0.1}>
            <NumberedItem number={index + 1} title={step} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 text-center">
        <Magnetic className="block sm:inline-block">
          <Button asChild size="lg" className="h-12 w-full px-8 sm:w-auto">
            <Link href="/get-involved">
              Join the Fellowship
              <ArrowRight />
            </Link>
          </Button>
        </Magnetic>
      </Reveal>
    </Section>
  );
}
