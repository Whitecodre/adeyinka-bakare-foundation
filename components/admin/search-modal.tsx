"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/admin/loading-state";
import { Search, X } from "lucide-react";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  url: string;
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Clear results when modal closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setResults([]);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl p-0 rounded-xl shadow-lg">
        <div className="p-6 border-b border-border mr-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search across all resources..."
              className="pl-12 pr-12 border-border bg-card text-foreground focus:border-ring focus:ring-ring/20"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  inputRef.current?.focus();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3 font-medium">
            Press <kbd className="px-2 py-1 bg-muted rounded-md text-[11px] font-medium">Esc</kbd> to close
          </p>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-12">
              <LoadingState message="Searching..." />
            </div>
          ) : query && results.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground/70" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-sm text-muted-foreground">
                No results found for &ldquo;<span className="font-medium text-foreground">{query}</span>&rdquo;
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                Try different keywords or check your spelling
              </p>
            </div>
          ) : !query ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-linear-to-br from-maroon-500 to-maroon-600 rounded-full flex items-center justify-center shadow-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Search resources
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Search across members, beneficiaries, programmes, events, news, testimonials, media, and more
              </p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-maroon-500 to-maroon-600 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {result.title}
                    </p>
                    {result.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {result.subtitle}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="bg-muted text-foreground border-border capitalize">
                    {result.type}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="p-4 border-t border-border text-xs text-muted-foreground/70 text-center">
            Use arrow keys to navigate, Enter to select
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
