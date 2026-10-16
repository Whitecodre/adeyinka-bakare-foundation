import { createClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";

export type AdminInviteRow = {
  id: string;
  email: string;
  full_name: string;
  role: "super_admin" | "admin" | "editor";
  token_hash: string;
  expires_at: string;
  invited_by: string | null;
  accepted_at: string | null;
  created_at: string;
};

export async function findInviteByTokenHash(hash: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_invites")
    .select("*")
    .eq("token_hash", hash)
    .maybeSingle();
  if (error) throw error;
  return data as AdminInviteRow | null;
}

export async function findPendingInviteByEmail(email: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_invites")
    .select("*")
    .ilike("email", email)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  return data as AdminInviteRow | null;
}

export async function listInvites() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_invites")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminInviteRow[];
}

export async function createInvite(row: {
  email: string;
  full_name: string;
  role: string;
  token_hash: string;
  expires_at: string;
  invited_by: string | null;
}) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("admin_invites").insert(row).select().single();
  if (error) throw error;
  return data as AdminInviteRow;
}

export async function markInviteAccepted(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_invites")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as AdminInviteRow;
}

export async function deleteInvite(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("admin_invites").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteExpiredInvites() {
  const supabase = createAdminClient();
  await supabase.from("admin_invites").delete().lt("expires_at", new Date().toISOString()).is("accepted_at", null);
}
