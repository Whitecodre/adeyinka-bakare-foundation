import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Disable TOTP by updating the admin_mfa record
    const { data, error } = await supabase
      .from("admin_mfa")
      .update({ totp_enabled: false, encrypted_totp_secret: null })
      .eq("admin_id", user.id)
      .select()
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "TOTP disabled successfully",
    });
  } catch (error) {
    console.error("TOTP disable error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to disable TOTP" },
      { status: 500 }
    );
  }
}