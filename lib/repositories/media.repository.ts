import { createClient } from "../supabase/server";
import type { Database, MediaInsert, MediaUpdate } from "../types/database.types";

type Media = Database["public"]["Tables"]["media"]["Row"];

export async function findAllMedia() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findMediaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createMedia(data: MediaInsert) {
  const supabase = await createClient();

  const { data: media, error } = await supabase
    .from("media")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return media;
}

export async function updateMedia(id: string, data: MediaUpdate) {
  const supabase = await createClient();

  const { data: media, error } = await supabase
    .from("media")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return media;
}

export async function deleteMedia(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("media").delete().eq("id", id);

  if (error) throw error;
}
