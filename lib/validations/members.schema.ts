import { z } from "zod";

export const memberSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  session: z.string().optional().nullable(),
  photo: z.string().url().optional().nullable(),
  status: z.enum(["active", "inactive", "graduated", "archived"]).optional(),
  joined_at: z.string().optional().nullable(),
});

export type MemberInput = z.infer<typeof memberSchema>;
