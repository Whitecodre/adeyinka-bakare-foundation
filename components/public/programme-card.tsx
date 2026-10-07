import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Briefcase, Users } from "lucide-react";

interface ProgrammeCardProps {
  programme: {
    id: string;
    title: string;
    description: string;
    image?: string | null;
    slug: string;
  };
}

const levelIcons = {
  "100L": { icon: BookOpen, color: "bg-[#aa322b]/10 text-[#aa322b]" },
  "200L": { icon: GraduationCap, color: "bg-[#f8c84d]/20 text-[#f8c84d]" },
  "300L": { icon: Briefcase, color: "bg-[#aa322b]/10 text-[#aa322b]" },
  "400L": { icon: Users, color: "bg-[#f8c84d]/20 text-[#f8c84d]" },
};

export function ProgrammeCard({ programme }: ProgrammeCardProps) {
  // Extract level from title or description
  const levelMatch = programme.title.match(/(\d+L)/);
  const level = levelMatch ? levelMatch[0] : "General";
  const iconData = levelIcons[level as keyof typeof levelIcons] || levelIcons["100L"];
  const Icon = iconData.icon;

  return (
    <Link
      href={`/programmes/${programme.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e9ddd3] hover:border-[#aa322b]/30"
    >
      {programme.image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={programme.image}
            alt={programme.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${iconData.color}`}>
          <Icon className="w-4 h-4" />
          {level}
        </div>
        <h3 className="text-xl font-bold text-[#2d1816] mb-3 font-['Libre_Baskerville'] group-hover:text-[#922821] transition-colors">
          {programme.title}
        </h3>
        <p className="text-[#2d1816]/70 mb-4 line-clamp-3">
          {programme.description}
        </p>
        <div className="flex items-center text-[#aa322b] font-semibold group-hover:translate-x-2 transition-transform duration-300">
          Learn More
          <ArrowRight className="w-5 h-5 ml-2" />
        </div>
      </div>
    </Link>
  );
}
