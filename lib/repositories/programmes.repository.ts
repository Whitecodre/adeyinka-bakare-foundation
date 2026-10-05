import { createClient } from "../supabase/server";
import type { Database, ProgrammeInsert, ProgrammeUpdate } from "../types/database.types";

type Programme = Database["public"]["Tables"]["programmes"]["Row"];

export async function findAllProgrammes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programmes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findPublishedProgrammes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programmes")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findProgrammeById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programmes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function findProgrammeBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programmes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;

  return data;
}

export async function createProgramme(data: ProgrammeInsert) {
  const supabase = await createClient();

  const { data: programme, error } = await supabase
    .from("programmes")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return programme;
}

export async function updateProgramme(id: string, data: ProgrammeUpdate) {
  const supabase = await createClient();

  const { data: programme, error } = await supabase
    .from("programmes")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return programme;
}

export async function deleteProgramme(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("programmes").delete().eq("id", id);

  if (error) throw error;
}
