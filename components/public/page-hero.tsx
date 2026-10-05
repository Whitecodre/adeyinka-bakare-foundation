interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/** Top of every inner page. Renders the page's one <h1>. Pure CSS animation, so it stays a Server Component. */
export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-maroon-50 to-cream pb-14 pt-14 md:pb-20 md:pt-24">
      <div
        aria-hidden
        className="abf-float absolute -right-16 -top-16 size-64 rounded-full bg-gradient-to-br from-gold-300 to-gold-200 opacity-60 blur-3xl"
      />
      <div
        aria-hidden
        className="abf-float absolute -bottom-24 -left-20 size-72 rounded-full bg-gradient-to-br from-maroon-300 to-maroon-200 opacity-50 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        {eyebrow && (
          <p className="abf-fade-up mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="abf-fade-up abf-delay-1 text-4xl font-bold text-foreground md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="abf-fade-up abf-delay-2 mt-5 text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        )}
        {children && <div className="abf-fade-up abf-delay-3 mt-8">{children}</div>}
      </div>
    </header>
  );
}
