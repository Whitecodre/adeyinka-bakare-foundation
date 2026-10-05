import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, actions }: AdminHeaderProps) {
  return (
    <header className="glass border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
