import { Card, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: string;
}

export function DashboardCard({ title, value, icon, trend }: DashboardCardProps) {
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {trend && (
              <p className={`text-sm mt-2 ${trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                {trend}
              </p>
            )}
          </div>
          {icon && (
            <div className="text-4xl text-gray-400">{icon}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
