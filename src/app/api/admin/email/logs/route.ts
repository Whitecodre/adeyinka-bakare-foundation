import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    await requireRole(["super_admin", "admin"]);
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("email_logs").select("*").order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err:any) {
    return NextResponse.json({ success:false, error: err.message }, { status:500 });
  }
}
