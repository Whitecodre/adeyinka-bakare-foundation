import { createClient } from "../supabase/server";
import type { Database, NotificationInsert } from "../types/database.types";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];
type NotificationUpdate = Database["public"]["Tables"]["notifications"]["Update"];

export async function findUserNotifications(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findUnreadNotifications(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", userId)
    .is("read_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function markNotificationAsRead(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function markAllNotificationsAsRead(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_id", userId)
    .is("read_at", null);

  if (error) throw error;
}

export async function deleteNotification(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("notifications").delete().eq("id", id);

  if (error) throw error;
}

export async function findAllNotifications() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findNotificationById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createNotification(data: NotificationInsert) {
  const supabase = await createClient();

  const { data: notification, error } = await supabase
    .from("notifications")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return notification;
}

export async function updateNotification(id: string, data: NotificationUpdate) {
  const supabase = await createClient();

  const { data: notification, error } = await supabase
    .from("notifications")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return notification;
}
