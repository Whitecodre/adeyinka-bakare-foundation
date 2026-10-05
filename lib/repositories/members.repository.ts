import { createClient } from "../supabase/server";
import type { Database, MemberInsert, MemberUpdate } from "../types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];

export async function findAllMembers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findMemberById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createMember(data: MemberInsert) {
  const supabase = await createClient();

  const { data: member, error } = await supabase
    .from("members")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return member;
}

export async function updateMember(id: string, data: MemberUpdate) {
  const supabase = await createClient();

  const { data: member, error } = await supabase
    .from("members")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return member;
}

export async function deleteMember(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) throw error;
}
