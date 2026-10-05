import { z } from "zod";

export const testimonialSchema = z.object({
  beneficiary_id: z.string().uuid().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  media_url: z.string().url().optional().nullable(),
  media_type: z.enum(["image", "audio", "video", "document", "other"]).optional().nullable(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
