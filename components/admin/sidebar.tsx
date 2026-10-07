"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  icon: any;
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
          className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[100] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          ${width} 
          ${isMobile ? "fixed left-0 top-0 h-screen z-[101]" : "sticky top-0 h-screen"}
          bg-[#2d1816] 
          border-r border-[#e9ddd3]/20 
          flex 
          flex-col 
          gap-2.5 
          transition-all duration-180
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : ""}
          md:translate-x-0
        `}
      >
        <div className="flex items-center gap-3 relative p-4 min-h-[72px]">
          <div className="w-10 h-10 bg-[#f8c84d] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Image
              src="/brand/logo.png"
              alt="ABF Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          {showLabels && (
            <div>
              <div className="text-white font-bold text-sm tracking-wider">ABF</div>
              <div className="text-[#f8c84d] text-xs">Admin console</div>
            </div>
          )}
        </div>

        <nav className="flex-1 flex flex-col gap-3.5 px-4 overflow-y-auto scrollbar-hide">
          {navGroups.map((group) => {
            const items = adminNavigation.filter((i) => i.group === group);
            if (!items.length) return null;
            return (
              <div key={group} className="flex flex-col gap-1">
                {showLabels && (
                  <div className="text-[#e9ddd3]/60 text-[10px] font-bold tracking-widest uppercase px-2 pb-1">
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
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-160
                        ${active 
                          ? "bg-[#f8c84d]/20 border border-[#f8c84d] text-[#f8c84d]" 
                          : "text-[#e9ddd3] hover:bg-[#f8c84d]/10 hover:text-white border border-transparent"
                        }
                        ${!showLabels ? "justify-center" : "justify-start"}
                      `}
                    >
                      <Icon size={19} className="flex-shrink-0" />
                      {showLabels && <span className="whitespace-nowrap flex-1">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="p-4">
          <button
            onClick={onLogout}
            className={`
              flex items-center gap-2.5 w-full px-3.5 py-2.75 rounded-xl border border-[#ef4444]/40 bg-[#ef4444]/12 text-[#f87171] font-bold cursor-pointer text-sm hover:bg-[#ef4444]/20 transition-colors
              ${!showLabels ? "justify-center" : "justify-center"}
            `}
          >
            <LogOut size={18} />
            {showLabels && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {tooltip && !isMobile && (
        <div
          className="fixed bg-[#2d1816] text-white text-xs px-2 py-1 rounded z-[102] pointer-events-none shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.label}
        </div>
      )}
    </>
  );
}
