import {
  findUserNotifications,
  findUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../repositories/notifications.repository";

export async function getUserNotifications(userId: string) {
  return findUserNotifications(userId);
}

export async function getUnreadNotifications(userId: string) {
  return findUnreadNotifications(userId);
}

export async function markAsRead(id: string) {
  return markNotificationAsRead(id);
}

export async function markAllAsRead(userId: string) {
  return markAllNotificationsAsRead(userId);
}

export async function removeNotification(id: string) {
  return deleteNotification(id);
}
