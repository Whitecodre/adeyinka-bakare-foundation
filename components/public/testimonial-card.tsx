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
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e9ddd3] hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          {testimonial.photo ? (
            <img
              src={testimonial.photo}
              alt={testimonial.full_name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#e9ddd3]"
            />
          ) : (
            <div className="w-14 h-14 bg-gradient-to-br from-[#aa322b]/20 to-[#f8c84d]/20 rounded-full flex items-center justify-center border-2 border-[#e9ddd3]">
              <span className="text-xl font-bold text-[#922821]">
                {testimonial.full_name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#2d1816] font-['Libre_Baskerville']">
            {testimonial.full_name}
          </h3>
          {testimonial.role && (
            <p className="text-sm text-[#2d1816]/60">{testimonial.role}</p>
          )}
        </div>
        <Quote className="w-8 h-8 text-[#f8c84d]/30 flex-shrink-0" />
      </div>

      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-[#f8c84d] text-[#f8c84d]"
          />
        ))}
      </div>

      <p className="text-[#2d1816]/80 leading-relaxed">
        "{testimonial.content}"
      </p>
    </div>
  );
}
