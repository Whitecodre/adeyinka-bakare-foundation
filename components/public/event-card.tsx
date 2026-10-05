import Link from "next/link";
import type { Event } from "@/lib/types/domain.types";
import { formatDate } from "@/lib/utils/dates";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow overflow-hidden">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <Badge variant="outline" className="mb-2">
          {formatDate(event.start_at)}
        </Badge>
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        {event.location && (
          <p className="text-gray-600 text-sm mb-4">📍 {event.location}</p>
        )}
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link
          href={`/events/${event.slug}`}
          className="text-primary hover:text-primary/80 font-medium"
        >
          View Event →
        </Link>
      </CardFooter>
    </Card>
  );
}
