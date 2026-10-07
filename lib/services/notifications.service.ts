import {
  findUserNotifications,
  findUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  findAllNotifications,
  findNotificationById,
  createNotification,
  updateNotification,
} from "../repositories/notifications.repository";
import type { NotificationInsert } from "../types/database.types";

export async function getAllNotifications() {
  return findAllNotifications();
}

export async function getNotificationById(id: string) {
  return findNotificationById(id);
}

export async function getUserNotifications(userId: string) {
  return findUserNotifications(userId);
}

export async function getUnreadNotifications(userId: string) {
  return findUnreadNotifications(userId);
}

export async function createNewNotification(data: NotificationInsert, actorId: string) {
  return createNotification(data);
}

export async function updateNotificationById(id: string, data: Partial<NotificationInsert>, actorId: string) {
  return updateNotification(id, data);
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
