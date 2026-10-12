import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PageHeaderAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: PageHeaderAction[];
}

/** Top of every admin page: title, one-line subtitle, and the page's actions. */
export function PageHeader({ title, subtitle, backHref, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      {backHref && (
        <Link
          href={backHref}
          className="mb-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground md:text-base">{subtitle}</p>}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
            {actions.map((action) => {
              const primary = action.variant !== "secondary";
              const content = (
                <>
                  {primary && <Plus />}
                  {action.label}
                </>
              );
              const className = "h-11 w-full px-5 sm:h-10 sm:w-auto";
              const variant = primary ? "brand" : "outline";

              return action.href ? (
                <Button key={action.label} asChild variant={variant} className={className}>
                  <Link href={action.href}>{content}</Link>
                </Button>
              ) : (
                <Button key={action.label} variant={variant} className={className} onClick={action.onClick}>
                  {content}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
