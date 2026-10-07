"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronRight, ArrowLeft, User, LogOut, Settings } from "lucide-react";
import { SearchModal } from "@/components/admin/search-modal";

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

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AdminHeader({ isMobile = false, onToggleSidebar, onLogout }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayName = "Admin";
  const displayEmail = "admin@abf.org";
  const roleLabel = "Super Admin";
  const initials = initialsOf(displayName);

  const title = pathname === "/admin" 
    ? "Overview" 
    : pathname.split("/").pop()?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Admin";
  
  const crumbs = pathname.split("/").filter(Boolean).slice(1);
  const isOverview = pathname === "/admin";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
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
    <header className="flex items-center justify-between gap-4 px-5 py-3.5 bg-[#fffdf8] border border-[#e9ddd3] rounded-2xl mb-4 sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center gap-3 min-w-0">
        <button
          className={`relative grid place-items-center rounded-xl border border-[#e9ddd3] bg-[#fffdf8] text-[#2d1816]/60 cursor-pointer transition-all hover:bg-[#e9ddd3]/30 ${isMobile ? "w-12 h-12" : "w-10 h-10"}`}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={isMobile ? 24 : 20} />
        </button>
        {!isOverview && (
          <button
            className="relative w-10 h-10 grid place-items-center rounded-xl border border-[#e9ddd3] bg-[#fffdf8] text-[#2d1816]/60 cursor-pointer hover:bg-[#e9ddd3]/30 transition-colors"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-base font-bold text-[#2d1816] m-0 whitespace-nowrap">{title}</h1>
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
            {crumbs.map((c, i) => (
              <span key={c + i} className="inline-flex items-center gap-1.5">
                <span className={i === crumbs.length - 1 ? "text-[#2d1816]/60" : "text-[#2d1816]/40"}>
                  {c.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
                {i < crumbs.length - 1 && <ChevronRight size={12} className="text-[#2d1816]/40" />}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3" ref={menuRef}>
        <div className="hidden sm:flex items-center gap-2 h-10 px-3.5 rounded-xl border border-[#e9ddd3] bg-[#fffdf8] w-24 focus-within:border-[#f8c84d] transition-colors cursor-pointer"
             onClick={() => setSearchOpen(true)}>
          <Search size={16} className="text-[#2d1816]/40 flex-shrink-0" />
          <input
            className="flex-1 bg-transparent border-0 outline-none text-[#2d1816] text-xs min-w-0 placeholder:text-[#2d1816]/40 cursor-pointer"
            placeholder="Search... (⌘K)"
            readOnly
            value=""
          />
        </div>

        <div className="relative">
          <button
            className="relative w-10 h-10 grid place-items-center rounded-xl border border-[#e9ddd3] bg-[#fffdf8] text-[#2d1816]/60 cursor-pointer hover:bg-[#e9ddd3]/30 transition-colors"
            onClick={() => {
              setNotifOpen((v) => {
                const next = !v;
                if (next) markAllRead();
                return next;
              });
              setMenuOpen(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && <span className="absolute top-2.25 right-2.5 w-2 h-2 rounded-full bg-[#ef4444] border-2 border-[#fffdf8]" />}
          </button>

          {notifOpen && (
            <div className="absolute top-12 right-0 w-72 bg-[#fffdf8] border border-[#e9ddd3] rounded-xl shadow-lg overflow-hidden z-[200] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 text-xs font-bold text-[#2d1816]/60 border-b border-[#e9ddd3]">
                Notifications{unreadCount > 0 ? ` · ${unreadCount} new` : ""}
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-xs text-[#2d1816]/60 text-center">
                  You&apos;re all caught up.
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 border-b border-[#e9ddd3] hover:bg-[#e9ddd3]/30 transition-colors cursor-pointer">
                    <div className="text-sm text-[#2d1816] font-semibold">{n.title}</div>
                    {n.body && <div className="text-xs text-[#2d1816]/60 mt-1">{n.body}</div>}
                    <div className="text-xs text-[#2d1816]/40 mt-1">{timeAgo(n.created_at)}</div>
                  </div>
                ))
              )}
              <button
                className="block w-full text-center px-4 py-3 bg-[#f8c84d]/20 border-t border-[#e9ddd3] text-[#f8c84d] text-xs font-bold cursor-pointer hover:bg-[#f8c84d]/30 transition-colors"
                onClick={() => { setNotifOpen(false); router.push("/admin/notifications"); }}
              >
                See all notifications
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="flex items-center gap-2.5 h-10 w-auto px-2.5 pr-3 rounded-xl border border-[#e9ddd3] bg-[#fffdf8] cursor-pointer hover:bg-[#e9ddd3]/30 transition-colors"
            onClick={() => {
              setMenuOpen((v) => !v);
              setNotifOpen(false);
            }}
            aria-label="Account menu"
          >
            <span className="w-7.5 h-7.5 rounded-lg grid place-items-center bg-gradient-to-br from-[#2CB6F4] to-[#3b82f6] text-[#06121b] font-bold text-xs overflow-hidden">
              {initials}
            </span>
            {!isMobile && (
              <span className="flex flex-col leading-tight text-left">
                <span className="text-xs font-bold text-[#2d1816]">{displayName}</span>
                <span className="text-xs text-[#2d1816]/60">{roleLabel}</span>
              </span>
            )}
          </button>

          {menuOpen && (
            <div className="absolute top-12 right-0 w-64 bg-[#fffdf8] border border-[#e9ddd3] rounded-xl shadow-lg overflow-hidden z-[200] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 text-xs font-bold text-[#2d1816]/60 border-b border-[#e9ddd3]">
                <div className="text-xs font-bold text-[#2d1816]">{displayName}</div>
                {displayEmail && <div className="text-xs font-medium text-[#2d1816]/60 mt-1">{displayEmail}</div>}
              </div>
              <button className="block w-full text-left px-4 py-3 bg-transparent border-0 text-[#2d1816] text-xs cursor-pointer hover:bg-[#e9ddd3]/30 transition-colors" onClick={() => { setMenuOpen(false); router.push("/admin/settings"); }}>
                Settings
              </button>
              <button className="block w-full text-left px-4 py-3 bg-transparent border-0 text-[#2d1816] text-xs cursor-pointer hover:bg-[#e9ddd3]/30 transition-colors" onClick={() => { setMenuOpen(false); router.push("/admin/notifications"); }}>
                Notifications
              </button>
              <button
                className="block w-full text-left px-4 py-3 bg-transparent border-0 text-[#f87171] text-xs cursor-pointer hover:bg-[#f87171]/10 transition-colors"
                onClick={() => { setMenuOpen(false); onLogout?.(); }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
