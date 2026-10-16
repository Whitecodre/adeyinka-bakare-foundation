import { z } from "zod";

export const mediaSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  storage_path: z.string().min(1, "Storage path is required"),
  type: z.enum(["image", "video", "audio", "document", "other"]),
  mime_type: z.string().optional(),
  size_bytes: z.number().int().optional(),
});

export type MediaInput = z.infer<typeof mediaSchema>;
