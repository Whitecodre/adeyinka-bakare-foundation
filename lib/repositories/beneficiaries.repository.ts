import { createClient } from "../supabase/server";
import type { Database, BeneficiaryInsert, BeneficiaryUpdate } from "../types/database.types";

type Beneficiary = Database["public"]["Tables"]["beneficiaries"]["Row"];

export async function findAllBeneficiaries() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("beneficiaries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findPublishedBeneficiaries() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("beneficiaries")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findBeneficiaryById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("beneficiaries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createBeneficiary(data: BeneficiaryInsert) {
  const supabase = await createClient();

  const { data: beneficiary, error } = await supabase
    .from("beneficiaries")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return beneficiary;
}

export async function updateBeneficiary(id: string, data: BeneficiaryUpdate) {
  const supabase = await createClient();

  const { data: beneficiary, error } = await supabase
    .from("beneficiaries")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return beneficiary;
}

export async function deleteBeneficiary(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("beneficiaries").delete().eq("id", id);

  if (error) throw error;
}
