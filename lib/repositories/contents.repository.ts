import { createClient } from "../supabase/server";
import type { Database, ContentInsert, ContentUpdate } from "../types/database.types";

type Content = Database["public"]["Tables"]["contents"]["Row"];

export async function findAllContents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findPublishedContents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contents")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findContentByKey(key: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contents")
    .select("*")
    .eq("key", key)
    .single();

  if (error) throw error;

  return data;
}

export async function createContent(data: ContentInsert) {
  const supabase = await createClient();

  const { data: content, error } = await supabase
    .from("contents")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return content;
}

export async function updateContent(id: string, data: ContentUpdate) {
  const supabase = await createClient();

  const { data: content, error } = await supabase
    .from("contents")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return content;
}

export async function deleteContent(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("contents").delete().eq("id", id);

  if (error) throw error;
}
