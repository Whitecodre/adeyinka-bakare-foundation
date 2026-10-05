import { z } from "zod";

export const settingsSchema = z.object({
  site_name: z.string().min(1, "Site name is required"),
  tagline: z.string().optional().nullable(),
  logo: z.string().url().optional().nullable(),
  favicon: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
