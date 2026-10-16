import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, ArrowRight, AlertCircle } from "lucide-react";
import { format } from "date-fns";

import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";
import { CTABanner } from "@/components/public/cta-banner";
import { EventCard } from "@/components/public/event-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getEvent(slug: string) {
  try {
    const response = await fetch(`${SITE_URL}/api/public/events/${slug}`, { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

async function getAllEvents() {
  try {
    const response = await fetch(`${SITE_URL}/api/public/events`, { cache: "no-store" });
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) {
    return {
      title: "Event | Adeyinka Bakare Fellowship",
      description: "Details of an ABF event.",
    };
  }
  const date = new Date(event.start_at);
  const month = format(date, "MMMM yyyy");
  const title = `${event.title} | Adeyinka Bakare Fellowship`;
  const description =
    event.description?.slice(0, 160) || `Join us on ${format(date, "MMMM d, yyyy")} — ${month}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: event.image ? [event.image] : ["/brand/logo.png"],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return (
      <>
        <Section className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 size-12 text-maroon-500/30" />
            <h1 className="text-3xl font-bold text-foreground">Event not found</h1>
            <p className="mt-2 text-muted-foreground">
              This event may have been moved or cancelled.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:text-maroon-700"
            >
              <ArrowLeft className="size-4" /> Back to all events
            </Link>
          </div>
        </Section>
      </>
    );
  }

  const allEvents = await getAllEvents();
  const upcoming = new Date(event.start_at).getTime() >= Date.now();
  const related = allEvents
    .filter((e: any) => e.slug !== slug && e.status === "published")
    .slice(0, 3);

  const startDate = new Date(event.start_at);
  const endDate = event.end_at ? new Date(event.end_at) : null;
  const sameDay = endDate && startDate.toDateString() === endDate.toDateString();

  return (
    <>
      {/* Cover */}
      {event.image ? (
        <div className="relative h-[48vh] min-h-[360px] w-full overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <div className="relative z-10 container mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-10 md:pb-14">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/85">
              {upcoming ? "Upcoming Event" : "Past Event"}
            </p>
            <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">
              {event.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/90">
              <span className="inline-flex items-center gap-2">
                <Calendar className="size-4" />
                {format(startDate, "EEEE, MMMM d, yyyy")}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4" />
                {format(startDate, "h:mm a")}
                {endDate && !sameDay && ` – ${format(endDate, "MMM d, h:mm a")}`}
                {endDate && sameDay && ` – ${format(endDate, "h:mm a")}`}
              </span>
              {event.location && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <PageHero
          eyebrow={upcoming ? "Upcoming Event" : "Past Event"}
          title={event.title}
          description={event.location || undefined}
        />
      )}

      {/* Back link */}
      <div className="container mx-auto max-w-4xl px-4 pt-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-maroon-700 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to all events
        </Link>
      </div>

      {/* Details */}
      <Section width="prose">
        <Reveal className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid gap-0 md:grid-cols-[auto_1fr]">
            <div className="flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-maroon-50 to-gold-50 px-6 py-8 text-center md:border-r md:border-border">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {format(startDate, "MMMM")}
              </span>
              <span className="text-5xl font-bold text-maroon-600">
                {format(startDate, "d")}
              </span>
              <span className="text-sm text-muted-foreground">
                {format(startDate, "yyyy")}
              </span>
              <span className="mt-1 text-sm font-medium text-foreground">
                {format(startDate, "HH:mm")}
              </span>
              {!upcoming && (
                <Badge variant="muted" className="mt-2">
                  Past
                </Badge>
              )}
            </div>
            <div className="space-y-6 p-6 md:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  About this event
                </p>
                <p className="mt-2 whitespace-pre-line text-foreground/90 leading-relaxed">
                  {event.description}
                </p>
              </div>
              {event.location && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Location
                  </p>
                  <p className="mt-2 flex items-start gap-2 text-foreground/90">
                    <MapPin className="mt-1 size-4 shrink-0 text-maroon-500" />
                    <span>{event.location}</span>
                  </p>
                </div>
              )}
              {(event.end_at || true) && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    When
                  </p>
                  <p className="mt-2 flex items-start gap-2 text-foreground/90">
                    <Calendar className="mt-1 size-4 shrink-0 text-maroon-500" />
                    <span>
                      {format(startDate, "PPPP h:mm a")}
                      {endDate && ` – ${format(endDate, "h:mm a")} (${format(endDate, "MMMM d, yyyy")})`}
                    </span>
                  </p>
                </div>
              )}
              <div className="flex flex-wrap gap-3 pt-2">
                {upcoming && (
                  <Button size="lg" className="h-12 px-8">
                    <Calendar className="size-4" />
                    Add to calendar
                  </Button>
                )}
                <Button asChild size="lg" variant="outline" className="h-12 px-8">
                  <a href="#details">Read details below</a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section tone="tint">
          <Reveal>
            <SectionHeading
              eyebrow="Keep Exploring"
              title="More Events"
              description="Other upcoming and past ABF activities."
              align="center"
            />
          </Reveal>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map((e: any, index: number) => (
              <Reveal key={e.id} delay={index * 0.08}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <CTABanner
        title={upcoming ? "Want to attend?" : "Discover more"}
        description={upcoming ? "Get in touch with the ABF team for registration and attendance." : "Check out more ABF events and join our community."}
        primary={{ label: "Contact ABF", href: "/contact" }}
        secondary={{ label: "All events", href: "/events" }}
      />
    </>
  );
}
