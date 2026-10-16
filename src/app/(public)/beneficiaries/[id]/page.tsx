import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, GraduationCap, AlertCircle, MapPin, Calendar } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";
import { CTABanner } from "@/components/public/cta-banner";
import { BeneficiaryCard } from "@/components/public/beneficiary-card";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getBeneficiary(id: string) {
  try {
    const response = await fetch(`${SITE_URL}/api/public/beneficiaries/${id}`, { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

async function getAllBeneficiaries() {
  try {
    const response = await fetch(`${SITE_URL}/api/public/beneficiaries`, { cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const beneficiary = await getBeneficiary(id);
  if (!beneficiary) {
    return { title: "Beneficiary | Adeyinka Bakare Fellowship" };
  }
  const title = `${beneficiary.full_name} | Adeyinka Bakare Fellowship`;
  const description =
    beneficiary.bio?.slice(0, 160) ||
    `Meet ${beneficiary.full_name}, ${beneficiary.programme ?? "ABF"} beneficiary.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: beneficiary.photo ? [beneficiary.photo] : ["/brand/logo.png"],
    },
  };
}

export default async function BeneficiaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const beneficiary = await getBeneficiary(id);

  if (!beneficiary) {
    return (
      <Section className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 size-12 text-maroon-500/30" />
          <h1 className="text-3xl font-bold text-foreground">Beneficiary not found</h1>
          <p className="mt-2 text-muted-foreground">This profile may have been moved.</p>
          <Link
            href="/beneficiaries"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:text-maroon-700"
          >
            <ArrowLeft className="size-4" /> Back to all beneficiaries
          </Link>
        </div>
      </Section>
    );
  }

  const all = await getAllBeneficiaries();
  const related = all.filter((b: any) => b.id !== id).slice(0, 3);

  return (
    <>
      {/* Hero photo + name */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-maroon-50 via-cream to-gold-50" />
        <div className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
          <Reveal>
            <Link
              href="/beneficiaries"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-maroon-700"
            >
              <ArrowLeft className="size-4" /> Back to all beneficiaries
            </Link>
          </Reveal>
          <div className="grid items-start gap-10 md:grid-cols-[280px_1fr]">
            <Reveal>
              {beneficiary.photo ? (
                <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={beneficiary.photo}
                    alt={beneficiary.full_name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="grid aspect-square place-items-center rounded-3xl border border-border bg-gradient-to-br from-maroon-500/10 to-gold-300/10 text-maroon-500/30">
                  <GraduationCap className="size-20" />
                </div>
              )}
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                ABF Beneficiary
              </p>
              <h1 className="mt-2 text-3xl font-bold text-foreground md:text-5xl">
                {beneficiary.full_name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {beneficiary.programme && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-maroon-500/10 px-3 py-1 text-xs font-semibold text-maroon-600">
                    {beneficiary.programme}
                  </span>
                )}
                {beneficiary.department && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-300/20 px-3 py-1 text-xs font-semibold text-gold-800">
                    {beneficiary.department}
                  </span>
                )}
                {beneficiary.level && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground">
                    {beneficiary.level}
                  </span>
                )}
              </div>
              {beneficiary.session && (
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" /> {beneficiary.session}
                </p>
              )}
            </Reveal>
          </div>
        </div>
      </div>

      {/* Bio */}
      {beneficiary.bio && (
        <Section width="prose">
          <Reveal>
            <SectionHeading eyebrow="About" title="Their story" align="left" />
            <p className="whitespace-pre-line text-lg leading-relaxed text-foreground/90">
              {beneficiary.bio}
            </p>
          </Reveal>
        </Section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <Section tone="tint">
          <Reveal>
            <SectionHeading
              eyebrow="More Beneficiaries"
              title="Meet other students"
              align="center"
            />
          </Reveal>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map((b: any, index: number) => (
              <Reveal key={b.id} delay={index * 0.08}>
                <BeneficiaryCard beneficiary={b} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <CTABanner
        title="Be part of the story"
        description="Apply for a scholarship or support a beneficiary today."
        primary={{ label: "Apply for support", href: "/get-involved" }}
        secondary={{ label: "Contact ABF", href: "/contact" }}
      />
    </>
  );
}
