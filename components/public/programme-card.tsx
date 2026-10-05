import Link from "next/link";
import type { Programme } from "@/lib/types/domain.types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProgrammeCardProps {
  programme: Programme;
}

export function ProgrammeCard({ programme }: ProgrammeCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow overflow-hidden">
      {programme.image && (
        <img
          src={programme.image}
          alt={programme.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{programme.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{programme.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link
          href={`/programmes/${programme.slug}`}
          className="text-primary hover:text-primary/80 font-medium"
        >
          Learn More →
        </Link>
      </CardFooter>
    </Card>
  );
}
