"use client";

import { useMemo, useRef, useState } from "react";
import { useAccount } from "@/components/admin/account-provider";
import { requirementForPath } from "@/lib/auth/permissions";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Loader2, Search, SearchX, X, type LucideIcon } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { adminNavigation } from "@/components/admin/sidebar";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  url: string;
}

interface PaletteItem {
  id: string;
  group: string;
  title: string;
  subtitle?: string;
  url: string;
  icon: LucideIcon;
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pageItems: PaletteItem[] = adminNavigation.map((item) => ({
  id: item.href,
  group: "Go to",
  title: item.label,
  subtitle: item.group,
  url: item.href,
  icon: item.icon,
}));

/** Command palette: jump to any dashboard page. Resource search plugs into `results` later. */
export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [active, setActive] = useState(0);
  const { account, can: canDo } = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo<PaletteItem[]>(() => {
    const q = query.trim().toLowerCase();
    // Only offer pages this role can open.
    const allowed = pageItems.filter((p) => {
      if (!account) return false;
      const needs = requirementForPath(p.url);
      return needs ? canDo(needs.resource, needs.action) : true;
    });
    const pages = q
      ? allowed.filter((p) => p.title.toLowerCase().includes(q) || p.subtitle?.toLowerCase().includes(q))
      : allowed;
    const found: PaletteItem[] = results.map((r) => ({
      id: r.id,
      group: "Results",
      title: r.title,
      subtitle: r.subtitle ?? r.type,
      url: r.url,
      icon: Search,
    }));
    return [...found, ...pages];
  }, [query, results, account, canDo]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery("");
      setResults([]);
      setActive(0);
    }
    onOpenChange(next);
  };

  const handleSearch = async (value: string) => {
    setQuery(value);
    setActive(0);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with a real resource search (members, programmes, events...)
      await new Promise((resolve) => setTimeout(resolve, 300));
      setResults([]);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const go = (item: PaletteItem) => {
    router.push(item.url);
    handleOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!items.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = (active + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      setActive(next);
      listRef.current?.querySelector(`[data-index="${next}"]`)?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(items[active]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="top-[12%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0 sm:p-0">
        <DialogTitle className="sr-only">Search the dashboard</DialogTitle>
        <DialogDescription className="sr-only">Type to find a page, then press Enter to open it.</DialogDescription>

        <div className="flex items-center gap-3 border-b border-border px-4 pr-14">
          {loading ? (
            <Loader2 className="size-5 shrink-0 animate-spin text-primary" />
          ) : (
            <Search className="size-5 shrink-0 text-muted-foreground" />
          )}
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages and resources..."
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="admin-search-list"
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setActive(0);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div ref={listRef} id="admin-search-list" role="listbox" className="max-h-[min(24rem,60dvh)] overflow-y-auto p-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-10 text-center">
              <div className="mb-3 grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
                <SearchX className="size-6" />
              </div>
              <p className="font-semibold text-foreground">No matches for &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a page name like Programmes or Events.</p>
            </div>
          ) : (
            items.map((item, index) => {
              const Icon = item.icon;
              const showGroup = index === 0 || items[index - 1].group !== item.group;
              return (
                <div key={`${item.group}-${item.id}`}>
                  {showGroup && (
                    <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      {item.group}
                    </p>
                  )}
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    data-index={index}
                    onMouseMove={() => setActive(index)}
                    onClick={() => go(item)}
                    className={cn(
                      "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left transition-colors",
                      index === active ? "bg-primary/10" : "hover:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
                        index === active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">{item.title}</span>
                      {item.subtitle && (
                        <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
                      )}
                    </span>
                    {index === active && <CornerDownLeft className="hidden size-4 shrink-0 text-primary sm:block" />}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-border bg-muted/50 px-4 py-2.5 text-xs text-muted-foreground sm:flex">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-medium">↑</kbd>
            <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-medium">↓</kbd>
            to move
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-medium">Enter</kbd>
            to open
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-medium">Esc</kbd>
            to close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
