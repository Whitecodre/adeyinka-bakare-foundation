import { createClient } from "../supabase/server";
import type { Database, AdminMfaInsert, AdminMfaUpdate, AdminPasskeyInsert, MfaRecoveryCodesInsert } from "../types/database.types";

type AdminMfa = Database["public"]["Tables"]["admin_mfa"]["Row"];
type AdminPasskey = Database["public"]["Tables"]["admin_passkeys"]["Row"];
type MfaRecoveryCode = Database["public"]["Tables"]["mfa_recovery_codes"]["Row"];

// Admin MFA Repository
export async function findAdminMfaByAdminId(adminId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admin_mfa")
    .select("*")
    .eq("admin_id", adminId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found

  return data;
}

export async function createAdminMfa(data: AdminMfaInsert) {
  const supabase = await createClient();

  const { data: mfa, error } = await supabase
    .from("admin_mfa")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return mfa;
}

export async function updateAdminMfa(adminId: string, data: AdminMfaUpdate) {
  const supabase = await createClient();

  const { data: mfa, error } = await supabase
    .from("admin_mfa")
    .update(data)
    .eq("admin_id", adminId)
    .select()
    .single();

  if (error) throw error;

  return mfa;
}

// Admin Passkeys Repository
export async function findPasskeyById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admin_passkeys")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function findPasskeyByCredentialId(credentialId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admin_passkeys")
    .select("*")
    .eq("credential_id", credentialId)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  return data;
}

export async function findPasskeysByAdminId(adminId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admin_passkeys")
    .select("*")
    .eq("admin_id", adminId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function createPasskey(data: AdminPasskeyInsert) {
  const supabase = await createClient();

  const { data: passkey, error } = await supabase
    .from("admin_passkeys")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return passkey;
}

export async function updatePasskey(id: string, data: Partial<AdminPasskeyInsert>) {
  const supabase = await createClient();

  const { data: passkey, error } = await supabase
    .from("admin_passkeys")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return passkey;
}

export async function deletePasskey(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("admin_passkeys").delete().eq("id", id);

  if (error) throw error;
}

// MFA Recovery Codes Repository
export async function findRecoveryCodesByAdminId(adminId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mfa_recovery_codes")
    .select("*")
    .eq("admin_id", adminId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function createRecoveryCode(data: MfaRecoveryCodesInsert) {
  const supabase = await createClient();

  const { data: code, error } = await supabase
    .from("mfa_recovery_codes")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return code;
}

export async function createRecoveryCodes(data: MfaRecoveryCodesInsert[]) {
  const supabase = await createClient();

  const { data: codes, error } = await supabase
    .from("mfa_recovery_codes")
    .insert(data)
    .select();

  if (error) throw error;

  return codes;
}

export async function deleteRecoveryCodesByAdminId(adminId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("mfa_recovery_codes")
    .delete()
    .eq("admin_id", adminId);

  if (error) throw error;
}
