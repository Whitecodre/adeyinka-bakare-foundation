import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional().nullable(),
  start_at: z.string().min(1, "Start date is required"),
  end_at: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.boolean().optional(),
});

export type EventInput = z.infer<typeof eventSchema>;
