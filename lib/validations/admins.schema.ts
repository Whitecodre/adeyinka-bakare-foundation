import { z } from "zod";

export const adminSchema = z.object({
  id: z.string().uuid("Invalid admin ID").optional(),
  full_name: z.string().min(1, "Name is required"),
  role: z.enum(["super_admin", "admin", "editor"]).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  email: z.string().email("Invalid email").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export const adminCreateSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["super_admin", "admin", "editor"]).default("editor"),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
});

export type AdminInput = z.infer<typeof adminSchema>;
export type AdminCreateInput = z.infer<typeof adminCreateSchema>;
