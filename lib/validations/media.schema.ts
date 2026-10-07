import { z } from "zod";

export const mediaSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  storage_path: z.string().min(1, "Storage path is required"),
  type: z.enum(["image", "audio", "video", "document", "other"]),
  mime_type: z.string().optional().nullable(),
  size_bytes: z.number().int().optional().nullable(),
});

export type MediaInput = z.infer<typeof mediaSchema>;
