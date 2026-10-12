import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  /** Filters or view toggles, shown beside the search box. */
  children?: React.ReactNode;
  className?: string;
}

/** Search box plus optional filters. One row on desktop, stacked on phones. */
export function Toolbar({ search, onSearchChange, placeholder = "Search...", children, className }: ToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)}>
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-11 bg-background pl-10 sm:h-10"
        />
      </div>
      {children}
    </div>
  );
}
