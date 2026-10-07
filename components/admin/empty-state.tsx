import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ComponentType<{ className?: string }>;
}

export function EmptyState({ title, description, action, icon: DefaultIcon }: EmptyStateProps) {
  const Icon = DefaultIcon || Inbox;
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-4 bg-[#e9ddd3]/30 rounded-full flex items-center justify-center">
        <Icon className="w-10 h-10 text-[#922821]/40" />
      </div>
      <h3 className="text-xl font-semibold text-[#2d1816] mb-2">{title}</h3>
      {description && (
        <p className="text-[#2d1816]/60 mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
