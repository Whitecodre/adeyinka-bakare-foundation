import { z } from "zod";

export const notificationSchema = z.object({
  recipient_id: z.string().uuid("Invalid recipient ID"),
  type: z.string().min(1, "Type is required"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  data: z.record(z.any(), z.any()).optional(),
});

export type NotificationInput = z.infer<typeof notificationSchema>;
