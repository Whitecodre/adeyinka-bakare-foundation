import { createClient } from "../supabase/server";
import type { Database, SiteSettingsUpdate } from "../types/database.types";

type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

export async function getSiteSettings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .single();

  if (error) throw error;

  return data;
}

export async function updateSiteSettings(data: SiteSettingsUpdate) {
  const supabase = await createClient();

  const { data: settings, error } = await supabase
    .from("site_settings")
    .update(data)
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .select()
    .single();

  if (error) throw error;

  return settings;
}
