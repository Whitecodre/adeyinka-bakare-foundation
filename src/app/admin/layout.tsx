"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { LogoutDialog } from "@/components/admin/logout-dialog";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved !== null) {
      setSidebarCollapsed(saved === "true");
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("admin-sidebar-collapsed", sidebarCollapsed.toString());
    }
  }, [sidebarCollapsed, mounted]);

  const handleLogout = () => {
    setLogoutOpen(true);
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="w-64 h-screen bg-ink shrink-0 border-r border-white/10" />
        <div className="flex flex-1 flex-col min-w-0 min-h-screen">
          <div className="h-16 shrink-0 border-b border-border bg-background" />
          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
      />
      <div className="flex flex-1 flex-col min-w-0 min-h-screen">
        <AdminHeader
          isMobile={isMobile}
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto bg-background p-4 md:p-6 lg:p-8">
          <div className="abf-fade-in mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
      <Toaster />
    </div>
  );
}
