import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";
import { CTABanner } from "@/components/public/cta-banner";
import { BeneficiaryCard } from "@/components/public/beneficiary-card";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Beneficiaries | Adeyinka Bakare Fellowship",
  description: "Meet the students who have benefited from our scholarship and support programmes.",
};

export const dynamic = "force-dynamic";

async function getBeneficiaries() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/public/beneficiaries`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching beneficiaries:", error);
    return [];
  }
}

export default async function BeneficiariesPage() {
  const beneficiaries = await getBeneficiaries();

  return (
    <>
      <PageHero
        eyebrow="Our Impact"
        title="Scholarship Beneficiaries"
        description="Meet the students whose academic journeys have been transformed through our support programmes."
      />

      <Section>
        {beneficiaries.length === 0 ? (
          <Reveal>
            <EmptyState
              title="No beneficiaries featured yet"
              description="We'll be showcasing our scholarship recipients soon."
            />
          </Reveal>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beneficiaries.map((beneficiary: any, index: number) => (
              <Reveal key={beneficiary.id} delay={index * 0.08}>
                <BeneficiaryCard beneficiary={beneficiary} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <CTABanner
        title="Want to be a beneficiary?"
        description="Apply for our scholarship programmes and get the support you need."
        primary={{ label: "Apply Now", href: "/get-involved" }}
        secondary={{ label: "Learn More", href: "/programmes" }}
      />
    </>
  );
}
