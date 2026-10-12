import { Crown, Shield, UserPen } from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Variant = NonNullable<BadgeProps["variant"]>;

const statusMap: Record<string, { label: string; variant: Variant; dot: string }> = {
  active: { label: "Active", variant: "success", dot: "bg-success" },
  published: { label: "Published", variant: "success", dot: "bg-success" },
  approved: { label: "Approved", variant: "success", dot: "bg-success" },
  pending: { label: "Pending", variant: "warning", dot: "bg-warning" },
  draft: { label: "Draft", variant: "warning", dot: "bg-warning" },
  inactive: { label: "Inactive", variant: "muted", dot: "bg-muted-foreground" },
  archived: { label: "Archived", variant: "muted", dot: "bg-muted-foreground" },
  suspended: { label: "Suspended", variant: "destructive", dot: "bg-destructive-foreground" },
  rejected: { label: "Rejected", variant: "destructive", dot: "bg-destructive-foreground" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

/** One status vocabulary for the whole dashboard: same word, same colour everywhere. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const entry = statusMap[status] ?? { label: status, variant: "muted" as Variant, dot: "bg-muted-foreground" };
  return (
    <Badge variant={entry.variant} className={cn("gap-1.5", className)}>
      <span className={cn("size-1.5 rounded-full", entry.dot)} aria-hidden="true" />
      {entry.label}
    </Badge>
  );
}

interface RoleBadgeProps {
  role: "super_admin" | "admin" | "editor";
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  if (role === "super_admin") {
    return (
      <Badge className={cn("gap-1 border-gold-400 bg-gold-300 text-ink hover:bg-gold-300", className)}>
        <Crown className="size-3" />
        Super Admin
      </Badge>
    );
  }
  if (role === "admin") {
    return (
      <Badge className={cn("gap-1 border-primary/30 bg-primary/10 text-primary shadow-none hover:bg-primary/10", className)}>
        <Shield className="size-3" />
        Admin
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className={cn("gap-1", className)}>
      <UserPen className="size-3" />
      Editor
    </Badge>
  );
}
