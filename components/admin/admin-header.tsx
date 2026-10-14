"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronRight, Settings, LogOut } from "lucide-react";
import { SearchModal } from "@/components/admin/search-modal";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  isMobile?: boolean;
  onToggleSidebar?: () => void;
  onLogout?: () => void;
}

interface NotifItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (!then) return "";
  const s = Math.floor((Date.now() - then) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
};

interface Account {
  name: string;
  email: string;
  role: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const iconButton =
  "relative grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:size-10";

const menuItem =
  "flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm text-foreground transition-colors hover:bg-muted";

/** Turns a URL segment into a readable label; ids become "Details". */
function crumbLabel(segment: string): string {
  if (/^[0-9a-f-]{8,}$/i.test(segment) || /^\d+$/.test(segment)) return "Details";
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AdminHeader({ onToggleSidebar, onLogout }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const [account, setAccount] = useState<Account | null>(null);
  const displayName = account?.name ?? "Admin";
  const displayEmail = account?.email ?? "";
  const roleLabel = account ? (ROLE_LABELS[account.role] ?? account.role) : "";
  const initials = initialsOf(displayName);

  const crumbs = pathname.split("/").filter(Boolean).slice(1);
  const isOverview = crumbs.length === 0;

  // Show the signed-in admin's real name, email and role.
  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();
      if (cancelled) return;
      setAccount({
        name: profile?.full_name ?? user.email ?? "Admin",
        email: user.email ?? "",
        role: profile?.role ?? "",
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 px-4 backdrop-blur md:px-6 lg:px-8">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 md:gap-3">
        <button className={iconButton} onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Menu className="size-5" />
        </button>

        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex items-center gap-1.5 text-sm">
            {isOverview ? (
              <li className="font-semibold text-foreground" aria-current="page">
                Overview
              </li>
            ) : (
              <>
                <li className="hidden sm:block">
                  <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                {crumbs.map((c, i) => {
                  const last = i === crumbs.length - 1;
                  const href = "/admin/" + crumbs.slice(0, i + 1).join("/");
                  return (
                    <li key={c + i} className={`flex min-w-0 items-center gap-1.5 ${last ? "" : "hidden sm:flex"}`}>
                      <ChevronRight className="hidden size-4 shrink-0 text-muted-foreground/60 sm:block" />
                      {last ? (
                        <span className="truncate font-semibold text-foreground" aria-current="page">
                          {crumbLabel(c)}
                        </span>
                      ) : (
                        <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">
                          {crumbLabel(c)}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </>
            )}
          </ol>
        </nav>

        <div className="flex items-center gap-1 md:gap-2" ref={menuRef}>
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search (Ctrl K)"
            className="hidden h-10 w-56 items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 text-sm text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex"
          >
            <Search className="size-4 shrink-0" />
            <span className="flex-1 text-left">Search</span>
            <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium">Ctrl K</kbd>
          </button>
          <button className={`${iconButton} lg:hidden`} onClick={() => setSearchOpen(true)} aria-label="Search">
            <Search className="size-5" />
          </button>

          <div className="relative">
            <button
              className={iconButton}
              onClick={() => {
                setNotifOpen((v) => {
                  const next = !v;
                  if (next) markAllRead();
                  return next;
                });
                setMenuOpen(false);
              }}
              aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
              aria-expanded={notifOpen}
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full border-2 border-background bg-destructive" />
              )}
            </button>

            {notifOpen && (
              <div className="fixed inset-x-4 top-[4.5rem] z-[200] overflow-hidden sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-80 rounded-xl border border-border bg-card shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">
                  Notifications{unreadCount > 0 ? ` · ${unreadCount} new` : ""}
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-muted-foreground">You&apos;re all caught up.</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="cursor-pointer border-b border-border px-4 py-3 transition-colors hover:bg-muted">
                      <div className="text-sm font-semibold text-foreground">{n.title}</div>
                      {n.body && <div className="mt-1 text-xs text-muted-foreground">{n.body}</div>}
                      <div className="mt-1 text-xs text-muted-foreground/70">{timeAgo(n.created_at)}</div>
                    </div>
                  ))
                )}
                <button
                  className="block min-h-11 w-full bg-accent px-4 text-center text-sm font-semibold text-primary transition-colors hover:bg-accent/70"
                  onClick={() => {
                    setNotifOpen(false);
                    router.push("/admin/notifications");
                  }}
                >
                  See all notifications
                </button>
              </div>
            )}
          </div>

          <span className="mx-1 hidden h-6 w-px bg-border md:block" aria-hidden="true" />

          <div className="relative">
            <button
              className="flex min-h-11 items-center gap-2.5 rounded-xl px-1.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:min-h-10 md:pr-3"
              onClick={() => {
                setMenuOpen((v) => !v);
                setNotifOpen(false);
              }}
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              <span className="grid size-8 place-items-center rounded-full bg-linear-to-br from-maroon-500 to-maroon-600 text-xs font-bold text-white">
                {initials}
              </span>
              <span className="hidden flex-col text-left leading-tight md:flex">
                <span className="text-sm font-semibold text-foreground">{displayName}</span>
                <span className="text-xs text-muted-foreground">{roleLabel}</span>
              </span>
            </button>

            {menuOpen && (
              <div className="fixed inset-x-4 top-[4.5rem] z-[200] overflow-hidden sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-64 rounded-xl border border-border bg-card shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="border-b border-border px-4 py-3">
                  <div className="text-sm font-semibold text-foreground">{displayName}</div>
                  {displayEmail && <div className="mt-0.5 text-xs text-muted-foreground">{displayEmail}</div>}
                </div>
                <button
                  className={menuItem}
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/admin/settings");
                  }}
                >
                  <Settings className="size-4 text-muted-foreground" />
                  Settings
                </button>
                <button
                  className={menuItem}
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/admin/notifications");
                  }}
                >
                  <Bell className="size-4 text-muted-foreground" />
                  Notifications
                </button>
                <button
                  className={`${menuItem} border-t border-border text-destructive hover:bg-destructive/10`}
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout?.();
                  }}
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
