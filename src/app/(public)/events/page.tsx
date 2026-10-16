import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";
import { CTABanner } from "@/components/public/cta-banner";
import { EventCard } from "@/components/public/event-card";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Events | Adeyinka Bakare Fellowship",
  description: "Stay updated with upcoming events, workshops, and activities from ABF.",
};

export const dynamic = "force-dynamic";

async function getEvents() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/public/events`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Upcoming Events"
        description="Join us for workshops, seminars, and networking events designed to enhance your skills and connect you with opportunities."
      />

      <Section>
        {events.length === 0 ? (
          <Reveal>
            <EmptyState
              title="No upcoming events"
              description="Check back soon for updates on our upcoming events and activities."
            />
          </Reveal>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: any, index: number) => (
              <Reveal key={event.id} delay={index * 0.08}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <CTABanner
        title="Want to host an event?"
        description="Connect with us to organize workshops, seminars, or networking sessions."
        primary={{ label: "Contact Us", href: "/contact" }}
        secondary={{ label: "Join ABF", href: "/get-involved" }}
      />
    </>
  );
}
