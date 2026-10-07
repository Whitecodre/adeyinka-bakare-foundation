import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "maroon" | "gold";
  change?: string;
  trend?: "up" | "down";
}

export function DashboardCard({ title, value, icon: Icon, color = "maroon", change, trend }: DashboardCardProps) {
  const colorClasses = {
    maroon: {
      bg: "bg-[#aa322b]/10",
      icon: "text-[#aa322b]",
      text: "text-[#922821]",
      hoverBg: "group-hover:bg-[#aa322b]/20",
      hoverBorder: "group-hover:border-[#aa322b]/50",
      hoverText: "group-hover:text-[#aa322b]",
    },
    gold: {
      bg: "bg-[#f8c84d]/20",
      icon: "text-[#f8c84d]",
      text: "text-[#b8860b]",
      hoverBg: "group-hover:bg-[#f8c84d]/30",
      hoverBorder: "group-hover:border-[#f8c84d]/50",
      hoverText: "group-hover:text-[#f8c84d]",
    },
  };

  const classes = colorClasses[color];

  return (
    <div className="bg-[#fffdf8] rounded-2xl p-6 shadow-sm border border-[#e9ddd3] hover:shadow-lg hover:border-[#e9ddd3]/70 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#2d1816]/70 mb-2 group-hover:text-[#2d1816] transition-colors duration-300">{title}</p>
          <p className="text-3xl font-bold text-[#2d1816] group-hover:text-[#aa322b] transition-colors duration-300">{value}</p>
          {change && trend && (
            <p
              className={`text-sm mt-2 font-medium transition-colors duration-300 ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {change} from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${classes.bg} ${classes.hoverBg} rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300`}>
          <Icon className={`w-6 h-6 ${classes.icon}`} />
        </div>
      </div>
    </div>
  );
}
