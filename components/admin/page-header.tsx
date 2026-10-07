import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
  }[];
}

export function PageHeader({ title, subtitle, backHref, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-[#2d1816]/60 hover:text-[#aa322b] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-[#2d1816] font-['Libre_Baskerville'] mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-[#2d1816]/70">{subtitle}</p>
      )}
      {actions && actions.length > 0 && (
        <div className="mt-6 flex gap-3">
          {actions.map((action, index) => {
            const baseClass =
              "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md";
            const variantClass =
              action.variant === "secondary"
                ? "bg-white border border-[#e9ddd3] text-[#2d1816] hover:border-[#aa322b]/30"
                : "bg-gradient-to-r from-[#aa322b] to-[#922821] text-white hover:from-[#922821] hover:to-[#7a221b]";

            return action.href ? (
              <Link key={index} href={action.href} className={`${baseClass} ${variantClass}`}>
                {action.variant === "primary" && <Plus className="w-5 h-5" />}
                {action.label}
              </Link>
            ) : (
              <button
                key={index}
                onClick={action.onClick}
                className={`${baseClass} ${variantClass}`}
              >
                {action.variant === "primary" && <Plus className="w-5 h-5" />}
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
