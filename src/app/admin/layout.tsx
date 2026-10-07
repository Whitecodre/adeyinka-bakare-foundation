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
      <div className="flex min-h-screen bg-[#fffdf8]">
        <div className="w-64 h-screen bg-[#2d1816] flex-shrink-0" />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-6 md:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fffdf8]">
      <Sidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          isMobile={isMobile}
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
      <Toaster />
    </div>
  );
}
