import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { Section } from "@/components/public/section";

interface PagePlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  /** For detail pages: a link back to the list page. */
  back?: { href: string; label: string };
}

/**
 * Structure for pages that are not built yet: the heading sits below the navbar,
 * the footer follows. Replace the body of <Section> when the page is built.
 */
export function PagePlaceholder({ eyebrow, title, description, back }: PagePlaceholderProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <Section width="prose" className="min-h-[40vh]">
        {back && (
          <Link
            href={back.href}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-maroon-700"
          >
            <ArrowLeft className="size-4" />
            {back.label}
          </Link>
        )}
        {/* Page content goes here. */}
        <p className="text-center text-muted-foreground">This page is being built.</p>
      </Section>
    </>
  );
}
