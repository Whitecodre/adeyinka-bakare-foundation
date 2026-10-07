import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  image: z.string().url().optional().nullable(),
  author_id: z.string().uuid().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  published_at: z.string().optional().nullable(),
  featured: z.boolean().optional(),
});

export type NewsInput = z.infer<typeof newsSchema>;
