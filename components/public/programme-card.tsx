import Image from "next/image";
import { Briefcase, Compass, GraduationCap, Wallet, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { IconTile, cardMotion } from "@/components/public/feature-card";
import { ScrollFocus } from "@/components/public/scroll-focus";

interface ProgrammeCardProps {
  programme: {
    title: string;
    slug: string;
    description: string;
    image?: string | null;
  };
  className?: string;
}

/** Icon per programme (meaning map in docs/design-system/foundations.md). Unknown slugs get the scholarship icon. */
const programmeIcons: Record<string, LucideIcon> = {
  "need-based-scholarship": Wallet,
  "merit-based-scholarship": GraduationCap,
  "internship-programme": Briefcase,
  "mentorship-programme": Compass,
};

export function ProgrammeCard({ programme, className }: ProgrammeCardProps) {
  const Icon = programmeIcons[programme.slug] ?? GraduationCap;

  return (
    <ScrollFocus tilt className={cn(cardMotion, "flex h-full flex-col overflow-hidden", className)}>
      {/* Same header on every card, so a programme with a photo and one without line up. */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-maroon-500/10 to-gold-300/15">
        {programme.image ? (
          <Image
            src={programme.image}
            alt={programme.title}
            fill
            unoptimized
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 group-data-[focused=true]:scale-105"
          />
        ) : (
          <Icon aria-hidden className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-primary/25" />
        )}
        <IconTile className="absolute left-5 top-5 shadow-md group-hover:-rotate-6 group-hover:scale-110 group-data-[focused=true]:-rotate-6 group-data-[focused=true]:scale-110">
          <Icon aria-hidden />
        </IconTile>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-xl font-semibold text-foreground">{programme.title}</h3>
        <p className="text-muted-foreground">{programme.description}</p>
      </div>
    </ScrollFocus>
  );
}
