import { createClient } from "../supabase/server";
import type { Database } from "../types/database.types";

type Media = Database["public"]["Tables"]["media"]["Row"];
type MediaInsert = Database["public"]["Tables"]["media"]["Insert"];
type MediaUpdate = Database["public"]["Tables"]["media"]["Update"];

export async function findAllMedia() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media")
    .select("*, uploader:profiles!media_uploaded_by_fkey(id, full_name)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Array<Media & { uploader: { id: string; full_name: string | null } | null }>;
}

export async function findMediaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media")
    .select("*, uploader:profiles!media_uploaded_by_fkey(id, full_name)")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Media & { uploader: { id: string; full_name: string | null } | null };
}

export async function createNewMedia(data: MediaInsert) {
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

export async function removeMedia(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("media").delete().eq("id", id);

  if (error) throw error;
}
