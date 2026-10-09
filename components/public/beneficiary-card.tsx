import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

interface BeneficiaryCardProps {
  beneficiary: {
    id: string;
    full_name: string;
    department?: string | null;
    programme?: string | null;
    level?: string | null;
    bio?: string | null;
    photo?: string | null;
  };
}

export function BeneficiaryCard({ beneficiary }: BeneficiaryCardProps) {
  return (
    <Link
      href={`/beneficiaries/${beneficiary.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-gold-300/30"
    >
      {beneficiary.photo ? (
        <div className="aspect-square overflow-hidden">
          <img
            src={beneficiary.photo}
            alt={beneficiary.full_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-square bg-gradient-to-br from-maroon-500/10 to-gold-300/10 flex items-center justify-center">
          <div className="w-20 h-20 bg-maroon-500/20 rounded-full flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-maroon-600 transition-colors">
          {beneficiary.full_name}
        </h3>
        {beneficiary.department && (
          <p className="text-sm text-muted-foreground mb-2">{beneficiary.department}</p>
        )}
        {beneficiary.level && (
          <span className="inline-block px-3 py-1 bg-gold-300/20 text-gold-800 text-xs font-semibold rounded-full mb-3">
            {beneficiary.level}
          </span>
        )}
        {beneficiary.programme && (
          <span className="inline-block px-3 py-1 bg-maroon-500/10 text-maroon-600 text-xs font-semibold rounded-full mb-3 ml-2">
            {beneficiary.programme}
          </span>
        )}
        {beneficiary.bio && (
          <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
            {beneficiary.bio}
          </p>
        )}
        <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
          View Profile
          <ArrowRight className="w-5 h-5 ml-2" />
        </div>
      </div>
    </Link>
  );
}
