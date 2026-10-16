import { z } from "zod";

export const contentSchema = z.object({
  key: z.string().min(1, "Key is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export type ContentInput = z.infer<typeof contentSchema>;
