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

export const adminInviteSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["super_admin", "admin", "editor"]).default("editor"),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(10, "Invalid token"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8),
}).refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export type AdminInput = z.infer<typeof adminSchema>;
export type AdminCreateInput = z.infer<typeof adminCreateSchema>;
export type AdminInviteInput = z.infer<typeof adminInviteSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
