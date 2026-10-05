import Link from "next/link";
import type { Beneficiary } from "@/lib/types/domain.types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
}

export function BeneficiaryCard({ beneficiary }: BeneficiaryCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow overflow-hidden">
      {beneficiary.photo && (
        <img
          src={beneficiary.photo}
          alt={beneficiary.full_name}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{beneficiary.full_name}</h3>
        {beneficiary.department && (
          <p className="text-gray-600 text-sm mb-2">{beneficiary.department}</p>
        )}
        {beneficiary.programme && (
          <Badge variant="secondary" className="mb-4">
            {beneficiary.programme}
          </Badge>
        )}
        {beneficiary.bio && (
          <p className="text-gray-600 mb-4 line-clamp-3">{beneficiary.bio}</p>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link
          href={`/beneficiaries/${beneficiary.id}`}
          className="text-primary hover:text-primary/80 font-medium"
        >
          View Profile →
        </Link>
      </CardFooter>
    </Card>
  );
}
