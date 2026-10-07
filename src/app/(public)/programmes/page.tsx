import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";
import { CTABanner } from "@/components/public/cta-banner";
import { ProgrammeCard } from "@/components/public/programme-card";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Programmes | Adeyinka Bakare Fellowship",
  description: "Discover our programmes designed to empower IT students through scholarships, mentorship, and career development.",
};

export const dynamic = "force-dynamic";

async function getProgrammes() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/public/programmes`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching programmes:", error);
    return [];
  }
}

export default async function ProgrammesPage() {
  const programmes = await getProgrammes();

  return (
    <>
      <PageHero
        eyebrow="Our Programmes"
        title="Empowering IT Students"
        description="Our programmes are designed to support students at every level of their academic journey, from 100L to 400L."
      />

      <Section>
        {programmes.length === 0 ? (
          <Reveal>
            <EmptyState
              title="No programmes available"
              description="Check back soon for updates on our programmes."
            />
          </Reveal>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {programmes.map((programme: any, index: number) => (
              <Reveal key={programme.id} delay={index * 0.08}>
                <ProgrammeCard programme={programme} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <CTABanner
        title="Ready to join a programme?"
        description="Apply for membership and access our comprehensive support programmes."
        primary={{ label: "Join the Fellowship", href: "/get-involved" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
