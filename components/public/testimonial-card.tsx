import { Quote, Play, Image as ImageIcon, Music, FileText } from "lucide-react";

interface Testimonial {
  id: string;
  content: string;
  full_name: string;
  role?: string | null;
  photo?: string | null;
  media_url?: string | null;
  media_type?: "image" | "video" | "audio" | "document" | "other" | null;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function MediaBadge({ type }: { type: Testimonial["media_type"] }) {
  if (!type || type === "other") return null;
  const map: Record<string, { Icon: any; label: string; classes: string }> = {
    image: { Icon: ImageIcon, label: "Photo", classes: "bg-maroon-500/10 text-maroon-600" },
    video: { Icon: Play, label: "Video", classes: "bg-maroon-500/10 text-maroon-600" },
    audio: { Icon: Music, label: "Audio", classes: "bg-maroon-500/10 text-maroon-600" },
    document: { Icon: FileText, label: "Document", classes: "bg-maroon-500/10 text-maroon-600" },
  };
  const m = map[type];
  if (!m) return null;
  const Icon = m.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${m.classes}`}>
      <Icon className="size-3" />
      {m.label}
    </span>
  );
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const showMedia =
    testimonial.media_url && testimonial.media_type && testimonial.media_type !== "other";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl">
      {showMedia && (
        <div className="relative h-56 w-full overflow-hidden bg-muted">
          {testimonial.media_type === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={testimonial.media_url!}
              alt={`Media from ${testimonial.full_name}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )}
          {testimonial.media_type === "video" && (
            <video
              src={testimonial.media_url!}
              controls
              className="h-full w-full object-cover"
            />
          )}
          {testimonial.media_type === "audio" && (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-maroon-50 to-gold-50 p-6">
              <audio src={testimonial.media_url!} controls className="w-full max-w-md" />
            </div>
          )}
          {testimonial.media_type === "document" && (
            <a
              href={testimonial.media_url!}
              target="_blank"
              rel="noreferrer"
              className="flex h-full items-center justify-center gap-3 bg-gradient-to-br from-maroon-50 to-gold-50 p-6 text-maroon-600 hover:text-maroon-700"
            >
              <FileText className="size-10" />
              <span className="text-sm font-semibold">Open document</span>
            </a>
          )}
          <div className="absolute right-3 top-3">
            <MediaBadge type={testimonial.media_type ?? null} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start gap-3">
          {testimonial.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={testimonial.photo}
              alt={testimonial.full_name}
              className="size-12 shrink-0 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-maroon-500/20 to-gold-300/20 text-base font-bold text-maroon-600">
              {(testimonial.full_name || "A").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-foreground">
              {testimonial.full_name || "ABF Member"}
            </h3>
            {testimonial.role && (
              <p className="truncate text-xs text-muted-foreground">{testimonial.role}</p>
            )}
          </div>
          <Quote className="size-7 shrink-0 text-gold-300/40" />
        </div>

        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">
          &ldquo;{testimonial.content}&rdquo;
        </p>
      </div>
    </div>
  );
}
