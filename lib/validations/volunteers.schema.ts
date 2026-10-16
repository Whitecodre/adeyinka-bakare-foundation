import { z } from "zod";

export const volunteerSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  interest: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
});

export type VolunteerInput = z.infer<typeof volunteerSchema>;

/** Admin-only: the public sign-up uses `volunteerSchema` and must never set a status. */
export const volunteerAdminUpdateSchema = volunteerSchema.partial().extend({
  status: z.enum(["new", "contacted", "accepted", "rejected", "archived"]).optional(),
});
