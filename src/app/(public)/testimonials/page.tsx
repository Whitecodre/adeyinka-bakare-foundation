import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";
import { CTABanner } from "@/components/public/cta-banner";
import { TestimonialCard } from "@/components/public/testimonial-card";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Testimonials | Adeyinka Bakare Fellowship",
  description: "Hear from our members and beneficiaries about their experiences with ABF.",
};

export const dynamic = "force-dynamic";

async function getTestimonials() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/public/testimonials`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="What Our Members Say"
        description="Hear directly from students whose lives have been impacted by our programmes and support."
      />

      <Section>
        {testimonials.length === 0 ? (
          <Reveal>
            <EmptyState
              title="No testimonials yet"
              description="We'll be sharing member stories soon."
            />
          </Reveal>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial: any, index: number) => (
              <Reveal key={testimonial.id} delay={index * 0.08}>
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <CTABanner
        title="Have a story to share?"
        description="We'd love to hear about your experience with ABF."
        primary={{ label: "Share Your Story", href: "/contact" }}
        secondary={{ label: "Join ABF", href: "/get-involved" }}
      />
    </>
  );
}
