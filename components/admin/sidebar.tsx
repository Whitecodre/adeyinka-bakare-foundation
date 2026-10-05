import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/config/admin-navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-dark min-h-screen border-r">
      <div className="p-6">
        <h2 className="text-white text-xl font-bold mb-6">Admin Dashboard</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <nav className="space-y-2">
            {adminNavigation.map((item: { href: string; label: string; icon: string }) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}
