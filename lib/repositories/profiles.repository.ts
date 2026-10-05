import { createClient } from "../supabase/server";
import type { Database, ProfileInsert, ProfileUpdate } from "../types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function findProfileById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function findAllProfiles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function createProfile(data: ProfileInsert) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return profile;
}

export async function updateProfile(id: string, data: ProfileUpdate) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return profile;
}

export async function deleteProfile(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) throw error;
}
