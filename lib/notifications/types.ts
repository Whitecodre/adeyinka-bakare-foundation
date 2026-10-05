export type NotificationType =
  | "new_volunteer"
  | "new_member"
  | "content_updated"
  | "system";

export interface NotificationData {
  [key: string]: any;
}
