import { createClient } from "../supabase/server";
import type { Database, NewsInsert, NewsUpdate } from "../types/database.types";

type News = Database["public"]["Tables"]["news"]["Row"];

export async function findAllNews() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findPublishedNews() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*, profiles(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findNewsById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*, profiles(*)")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function findNewsBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*, profiles(*)")
    .eq("slug", slug)
    .single();

  if (error) throw error;

  return data;
}

export async function createNews(data: NewsInsert) {
  const supabase = await createClient();

  const { data: news, error } = await supabase
    .from("news")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return news;
}

export async function updateNews(id: string, data: NewsUpdate) {
  const supabase = await createClient();

  const { data: news, error } = await supabase
    .from("news")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return news;
}

export async function deleteNews(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) throw error;
}
