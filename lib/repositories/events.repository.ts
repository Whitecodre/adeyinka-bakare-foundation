import { createClient } from "../supabase/server";
import type { Database, EventInsert, EventUpdate } from "../types/database.types";

type Event = Database["public"]["Tables"]["events"]["Row"];

export async function findAllEvents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findPublishedEvents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("start_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findEventById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function findEventBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;

  return data;
}

export async function createEvent(data: EventInsert) {
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return event;
}

export async function updateEvent(id: string, data: EventUpdate) {
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return event;
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) throw error;
}
