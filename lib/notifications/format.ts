import type { NotificationType } from "./types";

export function formatNotificationTitle(type: NotificationType): string {
  const titles: Record<NotificationType, string> = {
    new_volunteer: "New Volunteer Application",
    new_member: "New Member Added",
    content_updated: "Content Updated",
    system: "System Notification",
  };
  return titles[type] || "Notification";
}

export function formatNotificationMessage(type: NotificationType, data: any): string {
  switch (type) {
    case "new_volunteer":
      return `${data.full_name || "Someone"} submitted a volunteer application.`;
    case "new_member":
      return `${data.full_name || "Someone"} was added as a member.`;
    case "content_updated":
      return `Content "${data.key || "item"}" was updated.`;
    case "system":
      return data.message || "A system notification occurred.";
    default:
      return "You have a new notification.";
  }
}
