import type { Testimonial } from "@/lib/types/domain.types";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
        {testimonial.media_url && (
          <div className="mb-4">
            {testimonial.media_type === "video" ? (
              <video src={testimonial.media_url} controls className="w-full rounded" />
            ) : testimonial.media_type === "audio" ? (
              <audio src={testimonial.media_url} controls className="w-full" />
            ) : (
              <img src={testimonial.media_url} alt="Testimonial media" className="w-full rounded" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
