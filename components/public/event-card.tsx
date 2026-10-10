import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    start_at: string;
    end_at?: string | null;
    location?: string | null;
    image?: string | null;
    slug: string;
    featured?: boolean;
  };
}

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.start_at);
  const formattedDate = format(startDate, "MMM d, yyyy");
  const formattedTime = format(startDate, "h:mm a");

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-maroon-500/30"
    >
      {event.image ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-maroon-500/10 to-gold-300/10 flex items-center justify-center">
          <Calendar className="w-16 h-16 text-maroon-500/30" />
        </div>
      )}
      <div className="p-6">
        {event.featured && (
          <span className="inline-block px-3 py-1 bg-gold-300 text-foreground text-xs font-bold rounded-full mb-3">
            Featured
          </span>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
          <span aria-hidden>·</span>
          <span>{formattedTime}</span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-maroon-600 transition-colors">
          {event.title}
        </h3>
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        )}
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
          {event.description}
        </p>
        <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
          View Event
          <ArrowRight className="w-5 h-5 ml-2" />
        </div>
      </div>
    </Link>
  );
}
