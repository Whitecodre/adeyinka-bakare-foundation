import { Quote, Star } from "lucide-react";

interface TestimonialCardProps {
  testimonial: {
    id: string;
    full_name: string;
    content: string;
    role?: string | null;
    photo?: string | null;
  };
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          {testimonial.photo ? (
            <img
              src={testimonial.photo}
              alt={testimonial.full_name}
              className="w-14 h-14 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-14 h-14 bg-gradient-to-br from-maroon-500/20 to-gold-300/20 rounded-full flex items-center justify-center border-2 border-border">
              <span className="text-xl font-bold text-maroon-600">
                {testimonial.full_name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">
            {testimonial.full_name}
          </h3>
          {testimonial.role && (
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          )}
        </div>
        <Quote className="w-8 h-8 text-gold-300/30 flex-shrink-0" />
      </div>

      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-gold-300 text-gold-300"
          />
        ))}
      </div>

      <p className="text-foreground/80 leading-relaxed">
        &ldquo;{testimonial.content}&rdquo;
      </p>
    </div>
  );
}
