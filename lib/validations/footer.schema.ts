import { z } from "zod";

export const footerSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

export type FooterSectionInput = z.infer<typeof footerSectionSchema>;

export const footerLinkSchema = z.object({
  section_id: z.string().uuid("Invalid section ID"),
  label: z.string().min(1, "Label is required"),
  url: z.string().url("Invalid URL"),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

export type FooterLinkInput = z.infer<typeof footerLinkSchema>;
