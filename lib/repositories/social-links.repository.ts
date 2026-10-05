import { createClient } from "../supabase/server";
import type { Database, SocialLinkInsert, SocialLinkUpdate } from "../types/database.types";

type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];

export async function findAllSocialLinks() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data;
}

export async function createSocialLink(data: SocialLinkInsert) {
  const supabase = await createClient();

  const { data: link, error } = await supabase
    .from("social_links")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return link;
}

export async function updateSocialLink(id: string, data: SocialLinkUpdate) {
  const supabase = await createClient();

  const { data: link, error } = await supabase
    .from("social_links")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return link;
}

export async function deleteSocialLink(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("social_links").delete().eq("id", id);

  if (error) throw error;
}
