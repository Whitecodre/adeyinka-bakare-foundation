import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    await requirePermission("email", "read");
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("email_logs").select("*").order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err:any) {
    const denied = authErrorResponse(err);
    if (denied) return denied;
    return NextResponse.json({ success:false, error: err.message }, { status:500 });
  }
}
