import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  image?: string | null;
  featured?: boolean;
  published_at?: string | null;
  created_at: string;
  profiles?: { full_name?: string | null } | null;
}

interface NewsCardProps {
  news: NewsItem;
  variant?: "default" | "featured";
  index?: number;
}

export function NewsCard({ news, variant = "default", index = 0 }: NewsCardProps) {
  const dateStr = news.published_at || news.created_at;
  const date = new Date(dateStr);

  if (variant === "featured") {
    return (
      <Link
        href={`/news/${news.slug}`}
        className="group relative block overflow-hidden rounded-3xl border border-border shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-maroon-500/30"
      >
        {news.image ? (
          <div className="aspect-[21/9] overflow-hidden bg-gradient-to-br from-maroon-50 to-cream">
            <img
              src={news.image}
              alt={news.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-[21/9] bg-gradient-to-br from-maroon-500 via-maroon-600 to-maroon-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex flex-col justify-end p-6 md:p-10 max-w-2xl">
          {news.featured && (
            <span className="mb-3 inline-flex w-fit rounded-full bg-gold-300 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-maroon-900">
              Featured
            </span>
          )}
          <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
            <Calendar className="size-3.5" />
            {format(date, "MMM d, yyyy")}
          </p>
          <h2 className="text-2xl font-bold leading-tight text-white md:text-4xl">
            {news.title}
          </h2>
          {news.excerpt && (
            <p className="mt-3 line-clamp-2 text-sm text-white/85 md:text-base">
              {news.excerpt}
            </p>
          )}
          <div className="mt-5 inline-flex items-center gap-2 font-semibold text-gold-300">
            Read article
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/news/${news.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:border-maroon-500/30 hover:-translate-y-1"
    >
      {news.image ? (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={news.image}
            alt={news.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-maroon-50 via-cream to-gold-50 flex items-center justify-center">
          <span className="text-maroon-900/30 text-4xl font-black">ABF</span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="size-3.5" aria-hidden />
          <time dateTime={dateStr}>{format(date, "MMM d, yyyy")}</time>
          {news.profiles?.full_name && (
            <>
              <span aria-hidden>·</span>
              <span>{news.profiles.full_name}</span>
            </>
          )}
        </div>
        <h3 className="text-xl font-bold leading-snug text-foreground group-hover:text-maroon-600 transition-colors">
          {news.title}
        </h3>
        {news.excerpt && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {news.excerpt}
          </p>
        )}
        <div className="mt-auto pt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Read more
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
