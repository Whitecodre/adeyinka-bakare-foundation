import { createClient } from "../supabase/server";
import type { Database, VolunteerInsert, VolunteerUpdate } from "../types/database.types";

type Volunteer = Database["public"]["Tables"]["volunteers"]["Row"];

export async function findAllVolunteers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findVolunteerById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createVolunteer(data: VolunteerInsert) {
  const supabase = await createClient();

  const { data: volunteer, error } = await supabase
    .from("volunteers")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return volunteer;
}

export async function updateVolunteer(id: string, data: VolunteerUpdate) {
  const supabase = await createClient();

  const { data: volunteer, error } = await supabase
    .from("volunteers")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return volunteer;
}

export async function deleteVolunteer(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("volunteers").delete().eq("id", id);

  if (error) throw error;
}
