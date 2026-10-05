import { z } from "zod";

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Invalid URL"),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
