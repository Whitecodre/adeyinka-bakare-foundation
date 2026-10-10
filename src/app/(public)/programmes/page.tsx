import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section } from "@/components/public/section";
import { CTABanner } from "@/components/public/cta-banner";
import { IconTile } from "@/components/public/feature-card";
import { ProgrammeCard } from "@/components/public/programme-card";
import { getAllProgrammes } from "@/lib/services/programmes.service";

export const metadata: Metadata = {
  title: "Programmes | Adeyinka Bakare Fellowship",
  description:
    "Scholarship, internship and mentorship programmes for members of the Department of Information Technology.",
};

async function getPublishedProgrammes() {
  try {
    const programmes = await getAllProgrammes();
    return programmes.filter((programme) => programme.status === "published");
  } catch (error) {
    console.error("Error loading programmes:", error);
    return [];
  }
}

export default async function ProgrammesPage() {
  const programmes = await getPublishedProgrammes();

  return (
    <>
      <PageHero
        eyebrow="What ABF Offers"
        title="Our Programmes"
        description="Financial support, academic recognition, career development and professional mentorship for students of the Department of Information Technology."
      />

      <Section>
        {programmes.length === 0 ? (
          <Reveal>
            <div className="mx-auto flex max-w-md flex-col items-center text-center">
              <IconTile className="mb-4">
                <GraduationCap aria-hidden />
              </IconTile>
              <h2 className="text-xl font-semibold text-foreground">Programmes coming soon</h2>
              <p className="mt-2 text-muted-foreground">
                We are updating this page. Please check back shortly.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {programmes.map((programme, index) => (
              <Reveal key={programme.id} delay={index * 0.08}>
                <ProgrammeCard programme={programme} className="h-full" />
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <CTABanner
        title="Ready to join the Fellowship?"
        description="Programmes are open to registered ABF members. Find out how to join."
        primary={{ label: "How to join", href: "/get-involved" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
