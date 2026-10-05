import { z } from "zod";

export const contentSchema = z.object({
  key: z.string().min(1, "Key is required"),
  title: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export type ContentInput = z.infer<typeof contentSchema>;
