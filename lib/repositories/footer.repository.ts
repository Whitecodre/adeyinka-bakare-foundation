import { createClient } from "../supabase/server";
import type { Database, FooterSectionInsert, FooterSectionUpdate, FooterLinkInsert, FooterLinkUpdate } from "../types/database.types";

type FooterSection = Database["public"]["Tables"]["footer_sections"]["Row"];
type FooterLink = Database["public"]["Tables"]["footer_links"]["Row"];

export async function findAllFooterSections() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("footer_sections")
    .select("*, footer_links(*)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data;
}

export async function createFooterSection(data: FooterSectionInsert) {
  const supabase = await createClient();

  const { data: section, error } = await supabase
    .from("footer_sections")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return section;
}

export async function updateFooterSection(id: string, data: FooterSectionUpdate) {
  const supabase = await createClient();

  const { data: section, error } = await supabase
    .from("footer_sections")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return section;
}

export async function deleteFooterSection(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("footer_sections").delete().eq("id", id);

  if (error) throw error;
}

export async function createFooterLink(data: FooterLinkInsert) {
  const supabase = await createClient();

  const { data: link, error } = await supabase
    .from("footer_links")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return link;
}

export async function updateFooterLink(id: string, data: FooterLinkUpdate) {
  const supabase = await createClient();

  const { data: link, error } = await supabase
    .from("footer_links")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return link;
}

export async function deleteFooterLink(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("footer_links").delete().eq("id", id);

  if (error) throw error;
}
