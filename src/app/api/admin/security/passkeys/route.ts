import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("admin_passkeys")
      .select("id, credential_id, device_name, created_at, last_used_at, counter")
      .eq("admin_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    // Hide legacy placeholder that breaks verification (length error)
    const filtered = (data || []).filter((r: any) => r.credential_id !== "placeholder-credential-id" && r.credential_id.length > 10);
    // auto-clean placeholders in background
    const placeholders = (data || []).filter((r: any) => r.credential_id === "placeholder-credential-id");
    if (placeholders.length) {
      for (const ph of placeholders) { await supabase.from("admin_passkeys").delete().eq("id", ph.id); }
    }
    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to list passkeys" }, { status: 500 });
  }
}
