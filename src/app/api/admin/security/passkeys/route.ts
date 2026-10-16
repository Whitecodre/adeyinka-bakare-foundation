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

    // console.log("Passkeys query result:", data);
    // console.log("Passkeys count:", data?.length);

    // Only filter out actual placeholders
    const filtered = (data || []).filter((r: any) => {
      return r.credential_id !== "placeholder-credential-id" && r.credential_id.length > 10;
    });

    // console.log("Filtered passkeys count:", filtered.length);

    // strip public_key from response
    const safe = filtered.map(({ public_key, ...rest }: any) => rest);
    return NextResponse.json({ success: true, data: safe });
  } catch (error: any) {
    console.error("Passkeys list error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to list passkeys" }, { status: 500 });
  }
}
