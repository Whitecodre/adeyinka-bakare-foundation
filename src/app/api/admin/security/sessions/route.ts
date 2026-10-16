import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Try to fetch sessions from admin_sessions table
    const { data: sessions, error } = await supabase
      .from("admin_sessions")
      .select("*")
      .eq("admin_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get sessions error:", error);
      // If table doesn't exist or error, return empty array
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: sessions || [] });
  } catch (error) {
    console.error("Get sessions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
