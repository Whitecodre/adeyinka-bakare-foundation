import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: {
    label: string;
    href?: string;
    onClick?: () => void;
  }[];
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="text-gray-600 mt-2">{subtitle}</p>
      )}
      {actions && actions.length > 0 && (
        <div className="mt-4 flex gap-2">
          {actions.map((action, index) => (
            action.href ? (
              <Link key={index} href={action.href}>
                <Button>{action.label}</Button>
              </Link>
            ) : (
              <Button key={index} onClick={action.onClick}>
                {action.label}
              </Button>
            )
          ))}
        </div>
      )}
    </div>
  );
}
