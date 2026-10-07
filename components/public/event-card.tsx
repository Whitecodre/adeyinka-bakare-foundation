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
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e9ddd3] hover:border-[#aa322b]/30"
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
        <div className="aspect-video bg-gradient-to-br from-[#aa322b]/10 to-[#f8c84d]/10 flex items-center justify-center">
          <Calendar className="w-16 h-16 text-[#aa322b]/30" />
        </div>
      )}
      <div className="p-6">
        {event.featured && (
          <span className="inline-block px-3 py-1 bg-[#f8c84d] text-[#2d1816] text-xs font-bold rounded-full mb-3">
            Featured
          </span>
        )}
        <div className="flex items-center gap-2 text-sm text-[#2d1816]/60 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{formattedTime}</span>
        </div>
        <h3 className="text-xl font-bold text-[#2d1816] mb-3 font-['Libre_Baskerville'] group-hover:text-[#922821] transition-colors">
          {event.title}
        </h3>
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-[#2d1816]/60 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        )}
        <p className="text-[#2d1816]/70 mb-4 line-clamp-2 text-sm">
          {event.description}
        </p>
        <div className="flex items-center text-[#aa322b] font-semibold group-hover:translate-x-2 transition-transform duration-300">
          View Event
          <ArrowRight className="w-5 h-5 ml-2" />
        </div>
      </div>
    </Link>
  );
}
