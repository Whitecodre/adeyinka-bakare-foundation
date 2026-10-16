import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2, Newspaper } from "lucide-react";
import { format } from "date-fns";

import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";
import { CTABanner } from "@/components/public/cta-banner";
import { NewsCard } from "@/components/public/news-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "News Article | Adeyinka Bakare Fellowship",
      description: "Read the latest update from ABF.",
    };
  }

  const title = `${article.title} | Adeyinka Bakare Fellowship`;
  const description =
    article.excerpt ||
    "Read the latest news and updates from the Adeyinka Bakare Fellowship.";
  const ogImage = article.image ? [article.image] : ["/brand/logo.png"];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.published_at || article.created_at,
      authors: article.profiles?.full_name ? [article.profiles.full_name] : undefined,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage,
    },
  };
}

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getArticle(slug: string) {
  try {
    const response = await fetch(`${SITE_URL}/api/public/news/${slug}`, { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.success) return null;
    return data.data as any;
  } catch (error) {
    console.error("Error fetching news article:", error);
    return null;
  }
}

async function getAllNews() {
  try {
    const response = await fetch(`${SITE_URL}/api/public/news`, { cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

function readingTimeMinutes(html: string) {
  if (!html) return 0;
  const text = html.replace(/<[^>]+>/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <>
        <Section className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Newspaper className="mx-auto mb-4 size-12 text-maroon-500/30" />
            <h1 className="text-3xl font-bold text-foreground">Article not found</h1>
            <p className="mt-2 text-muted-foreground">
              This article may have been moved or deleted.
            </p>
            <Link
              href="/news"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:text-maroon-700"
            >
              <ArrowLeft className="size-4" /> Back to all news
            </Link>
          </div>
        </Section>
      </>
    );
  }

  const allNews = await getAllNews();
  const related = allNews
    .filter((n: any) => n.slug !== slug)
    .slice(0, 3);
  const dateStr = article.published_at || article.created_at;
  const minutes = readingTimeMinutes(article.content || "");

  return (
    <>
      {/* Hero cover */}
      {article.image ? (
        <div className="relative h-[44vh] min-h-[320px] w-full overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <div className="relative z-10 container mx-auto flex h-full max-w-4xl flex-col justify-end px-4 pb-10 md:pb-14">
            {article.featured && (
              <span className="mb-3 inline-flex w-fit rounded-full bg-gold-300 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-maroon-900">
                Featured
              </span>
            )}
            <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/85">
              <Calendar className="size-3.5" />
              {format(new Date(dateStr), "MMMM d, yyyy")}
              <span aria-hidden>·</span>
              <Clock className="size-3.5" />
              {minutes} min read
              {article.profiles?.full_name && (
                <>
                  <span aria-hidden>·</span>
                  <span>By {article.profiles.full_name}</span>
                </>
              )}
            </p>
            <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
                {article.excerpt}
              </p>
            )}
            {(article.tags || []).length > 0 && (
              <ul className="mt-4 flex max-w-2xl flex-wrap gap-2">
                {(article.tags as string[]).map((tag) => (
                  <li
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full border border-gold-200/80 bg-gold-300/20 px-3.5 py-1.5 text-xs font-bold text-gold-200 backdrop-blur-sm transition-all duration-300 active:scale-95 active:bg-gold-400 active:text-ink hover:-translate-y-0.5 hover:-rotate-2 hover:border-gold-400 hover:bg-gold-400 hover:text-ink"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <PageHero
          eyebrow="News Article"
          title={article.title}
          description={article.excerpt || undefined}
        />
      )}

      {/* Back link */}
      <div className="container mx-auto max-w-4xl px-4 pt-8">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-maroon-700 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to all news
        </Link>
      </div>

      {/* Article body */}
      <Section width="prose">
        <Reveal>
          <article className="abf-prose mx-auto max-w-3xl">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} className="abf-prose-body" />
            ) : (
              <p className="text-muted-foreground">No content available.</p>
            )}
          </article>

          {/* Author / meta */}
          <div className="mt-10 flex items-center gap-4 border-t border-border pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-maroon-500 to-gold-300 text-white font-bold">
              {(article.profiles?.full_name || "ABF").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {article.profiles?.full_name || "Adeyinka Bakare Fellowship"}
              </p>
              <p className="text-xs text-muted-foreground">
                Published {format(new Date(dateStr), "MMMM d, yyyy")}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`${SITE_URL}/news/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Share2 className="size-3.5" />
                Share
              </a>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section tone="tint">
          <Reveal>
            <SectionHeading
              eyebrow="Keep Reading"
              title="More ABF News"
              description="Discover other recent announcements and stories."
              align="center"
            />
          </Reveal>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item: any, index: number) => (
              <Reveal key={item.id} delay={index * 0.08}>
                <NewsCard news={item} index={index} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <CTABanner
        title="Stay close to ABF"
        description="Subscribe to our newsletter for updates on programmes and scholarship opportunities."
        primary={{ label: "Subscribe Now", href: "/#newsletter" }}
        secondary={{ label: "All News", href: "/news" }}
      />
    </>
  );
}
