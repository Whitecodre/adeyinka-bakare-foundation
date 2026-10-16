import { Button } from "@/components/ui/button";

interface LinkButtonProps {
  /** Empty string renders a disabled button, so there are never dead links. */
  href: string;
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

/** Button that opens an external ABF link (registration form, WhatsApp) in a new tab. */
export function LinkButton({ href, children, variant = "default", className }: LinkButtonProps) {
  if (!href) {
    return (
      <Button size="lg" variant={variant} disabled className={className} title="Link coming soon">
        {children}
      </Button>
    );
  }

  return (
    <Button asChild size="lg" variant={variant} className={className}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}
