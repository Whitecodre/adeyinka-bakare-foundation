import { z } from "zod";

export const beneficiarySchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  department: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  session: z.string().optional().nullable(),
  programme: z.string().optional().nullable(),
  photo: z.string().url().optional().nullable(),
  bio: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.boolean().optional(),
});

export type BeneficiaryInput = z.infer<typeof beneficiarySchema>;
