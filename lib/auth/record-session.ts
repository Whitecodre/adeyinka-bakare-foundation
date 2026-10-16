import { createClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";
import type { NextRequest } from "next/server";

/**
 * Record an admin's current session in `admin_sessions` so it shows up
 * under "Active Sessions" in the admin security page. Idempotent:
 * if a row with the same session_token already exists, this is a no-op
 * (the table's UNIQUE constraint on `session_token` would otherwise
 * throw on duplicate inserts).
 */
export async function recordAdminSession(opts: {
  request?: NextRequest;
  adminId: string;
  sessionToken?: string | null;
}) {
  const { request, adminId, sessionToken: providedToken } = opts;
  let sessionToken = providedToken ?? null;

  if (!sessionToken) {
    // Pull the current access_token out of the user's session cookies.
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getSession();
      sessionToken = data.session?.access_token ?? null;
    } catch {
      sessionToken = null;
    }
  }

  if (!sessionToken) return;

  const ip_address =
    request?.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request?.headers.get("x-real-ip") ||
    null;
  const user_agent = request?.headers.get("user-agent") || null;

  try {
    const admin = createAdminClient();
    const { error: existsErr } = await admin
      .from("admin_sessions")
      .select("id")
      .eq("session_token", sessionToken)
      .maybeSingle();
    if (existsErr) {
      console.error("recordAdminSession: lookup error", existsErr);
    }

    const { error } = await admin.rpc("insert_admin_session", {
      p_admin_id: adminId,
      p_session_token: sessionToken,
      p_ip_address: ip_address,
      p_user_agent: user_agent,
    });

    if (error && !String(error.message).toLowerCase().includes("duplicate")) {
      console.error("recordAdminSession: insert error", error);
    }
  } catch (e) {
    console.error("recordAdminSession: failed", e);
  }
}
