import { z } from "zod";

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  // https links, plus mailto: for the email platform
  url: z.string().refine((v) => /^(https?:\/\/\S+|mailto:\S+)$/i.test(v.trim()), "Invalid URL"),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
