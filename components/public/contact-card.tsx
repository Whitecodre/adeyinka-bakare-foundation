import { cn } from "@/lib/utils";
import { IconTile } from "@/components/public/feature-card";

interface ContactCardProps {
  icon: React.ReactNode;
  label: string;
  /** Text shown for the channel, e.g. the email address. */
  value: string;
  href: string;
  external?: boolean;
}

const cardClass =
  "flex min-h-[44px] items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all duration-300";

/** One contact channel. Without a link it shows "Coming soon" and is not clickable. */
export function ContactCard({ icon, label, value, href, external = false }: ContactCardProps) {
  const content = (
    <>
      <IconTile className="size-11">{icon}</IconTile>
      <span className="min-w-0">
        <span className="block text-sm text-muted-foreground">{label}</span>
        <span className={cn("block truncate font-semibold", href ? "text-foreground" : "text-muted-foreground")}>
          {href ? value : "Coming soon"}
        </span>
      </span>
    </>
  );

  if (!href) {
    return <div className={cardClass}>{content}</div>;
  }

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        cardClass,
        "hover:-translate-y-1 hover:border-maroon-200 hover:shadow-lg hover:shadow-maroon-700/10 active:scale-[0.98]"
      )}
    >
      {content}
    </a>
  );
}
