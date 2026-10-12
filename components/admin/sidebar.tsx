"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Calendar,
  Newspaper,
  Image as ImageIcon,
  FileText,
  Layout,
  Share2,
  Settings,
  Bell,
  Shield,
  Lock,
  LogOut,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  group?: string;
}

const adminNavigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    group: "Main",
  },
  {
    label: "Members",
    href: "/admin/members",
    icon: Users,
    group: "People",
  },
  {
    label: "Volunteers",
    href: "/admin/volunteers",
    icon: UserPlus,
    group: "People",
  },
  {
    label: "Beneficiaries",
    href: "/admin/beneficiaries",
    icon: GraduationCap,
    group: "People",
  },
  {
    label: "Programmes",
    href: "/admin/programmes",
    icon: BookOpen,
    group: "Content",
  },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquare,
    group: "Content",
  },
  {
    label: "Events",
    href: "/admin/events",
    icon: Calendar,
    group: "Content",
  },
  {
    label: "News",
    href: "/admin/news",
    icon: Newspaper,
    group: "Content",
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: ImageIcon,
    group: "Content",
  },
  {
    label: "Content",
    href: "/admin/contents",
    icon: FileText,
    group: "Content",
  },
  {
    label: "Footer",
    href: "/admin/footer",
    icon: Layout,
    group: "Site",
  },
  {
    label: "Social Links",
    href: "/admin/social-links",
    icon: Share2,
    group: "Site",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    group: "Account",
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    group: "Account",
  },
  {
    label: "Admins",
    href: "/admin/admins",
    icon: Shield,
    group: "Account",
  },
  {
    label: "Security",
    href: "/admin/security",
    icon: Lock,
    group: "Account",
  },
];

const navGroups = Array.from(new Set(adminNavigation.map((item) => item.group).filter(Boolean)));

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
  collapsed?: boolean;
}

export function Sidebar({ isMobile = false, isOpen = false, onClose, onLogout, collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);

  const width = collapsed && !isMobile ? "w-20" : "w-64";
  const showLabels = !collapsed || isMobile;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Admin navigation"
        className={`
          ${width}
          ${isMobile ? "fixed left-0 top-0 z-[101] h-dvh" : "sticky top-0 h-screen"}
          flex flex-col gap-2.5 border-r border-white/10 bg-ink transition-all duration-200
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : ""}
          md:translate-x-0
        `}
      >
        <div className="flex min-h-[72px] items-center gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gold-300">
            <Image
              src="/brand/logo.png"
              alt="ABF Logo"
              width={40}
              height={40}
              className="size-full object-cover"
            />
          </div>
          {showLabels && (
            <div>
              <div className="text-sm font-bold tracking-wider text-white">ABF</div>
              <div className="text-xs text-gold-300">Admin console</div>
            </div>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 pb-2 scrollbar-hide">
          {navGroups.map((group) => {
            const items = adminNavigation.filter((i) => i.group === group);
            if (!items.length) return null;
            return (
              <div key={group} className="flex flex-col gap-1">
                {showLabels && (
                  <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
                    {group}
                  </div>
                )}
                {items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={isMobile ? onClose : undefined}
                      aria-current={active ? "page" : undefined}
                      aria-label={!showLabels ? item.label : undefined}
                      onMouseEnter={(e) => {
                        if (!showLabels && !isMobile) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            label: item.label,
                            x: rect.right + 8,
                            y: rect.top + rect.height / 2 - 12,
                          });
                        }
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      className={`
                        group relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors duration-150
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300
                        ${
                          active
                            ? "bg-gold-300/15 text-gold-300"
                            : "text-white/75 hover:bg-white/10 hover:text-white"
                        }
                        ${!showLabels ? "justify-center" : "justify-start"}
                      `}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gold-300" />
                      )}
                      <Icon className="size-5 shrink-0 transition-transform duration-150 group-hover:scale-110" />
                      {showLabels && <span className="flex-1 whitespace-nowrap">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="p-3">
          <button
            onClick={onLogout}
            aria-label="Sign out"
            className="flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-destructive/40 bg-destructive/15 px-3.5 text-sm font-bold text-white transition-colors hover:bg-destructive/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
          >
            <LogOut className="size-[18px]" />
            {showLabels && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {tooltip && !isMobile && (
        <div
          className="pointer-events-none fixed z-[102] rounded bg-ink px-2 py-1 text-xs text-white shadow-lg ring-1 ring-white/10"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.label}
        </div>
      )}
    </>
  );
}
