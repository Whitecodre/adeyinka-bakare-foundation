import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("admin_passkeys")
      .select("id, credential_id, device_name, created_at, last_used_at, counter, public_key")
      .eq("admin_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    // Hide legacy placeholder and auto-clean any corrupted base64url-stored keys
    const toDelete: string[] = [];
    const filtered = (data || []).filter((r: any) => {
      if (r.credential_id === "placeholder-credential-id" || r.credential_id.length <= 10) { toDelete.push(r.id); return false; }
      // Detect broken base64url-string-stored-as-bytea (from one bad deploy)
      try {
        const raw: any = (r as any).public_key;
        let bytes: Uint8Array | null = null;
        if (typeof raw === "string" && raw.startsWith("\\x")) bytes = new Uint8Array(Buffer.from(raw.slice(2), "hex"));
        else if (typeof raw === "string") {
          try { bytes = new Uint8Array(Buffer.from(raw, "base64")); } catch { bytes = null; }
        }
        if (bytes) {
          const asUtf8 = Buffer.from(bytes).toString("utf8");
          if (/^[A-Za-z0-9_-]{50,}$/.test(asUtf8)) { toDelete.push(r.id); return false; }
          if (bytes.length > 0 && bytes.length < 32) { toDelete.push(r.id); return false; }
        }
      } catch {}
      return true;
    });
    if (toDelete.length) {
      for (const id of toDelete) { await supabase.from("admin_passkeys").delete().eq("id", id); }
    }
    // strip public_key from response
    const safe = filtered.map(({ public_key, ...rest }: any) => rest);
    return NextResponse.json({ success: true, data: safe });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to list passkeys" }, { status: 500 });
  }
}
