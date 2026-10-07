import { z } from "zod";

export const programmeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.boolean().optional(),
});

export type ProgrammeInput = z.infer<typeof programmeSchema>;
