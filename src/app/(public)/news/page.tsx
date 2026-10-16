import type { Metadata } from "next";

import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";
import { CTABanner } from "@/components/public/cta-banner";
import { NewsCard } from "@/components/public/news-card";
import { EmptyState } from "@/components/admin/empty-state";

export const metadata: Metadata = {
  title: "News | Adeyinka Bakare Fellowship",
  description:
    "Read the latest announcements, programme updates, and stories from the Adeyinka Bakare Fellowship.",
};

export const dynamic = "force-dynamic";

async function getNews() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/public/news`,
      { cache: "no-store" }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export default async function NewsPage() {
  const news = await getNews();

  const featured = news.find((n: any) => n.featured) || news[0];
  const rest = (featured ? news.filter((n: any) => n.id !== featured.id) : news) as any[];

  return (
    <>
      <PageHero
        eyebrow="Insights & Updates"
        title="ABF in the Making"
        description="Announcements, programme highlights, scholarship updates, and stories from the Adeyinka Bakare Fellowship."
      />

      <Section>
        {news.length === 0 ? (
          <Reveal>
            <EmptyState
              title="No news yet"
              description="We'll be sharing updates soon. Check back shortly."
            />
          </Reveal>
        ) : (
          <div className="space-y-14">
            {featured && (
              <Reveal>
                <NewsCard news={featured} variant="featured" />
              </Reveal>
            )}
            {rest.length > 0 && (
              <>
                <Reveal delay={0.1}>
                  <SectionHeading
                    eyebrow="More Stories"
                    title="Latest Updates"
                    description="Browse all our recent announcements and articles."
                  />
                </Reveal>
                <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((item: any, index: number) => (
                    <Reveal key={item.id} delay={index * 0.07}>
                      <NewsCard news={item} index={index} />
                    </Reveal>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Section>

      <CTABanner
        title="Want to stay in the loop?"
        description="Subscribe to our newsletter and never miss an ABF update."
        primary={{ label: "Subscribe Now", href: "/#newsletter" }}
        secondary={{ label: "Contact ABF", href: "/contact" }}
      />
    </>
  );
}
