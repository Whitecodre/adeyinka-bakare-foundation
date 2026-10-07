import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const body = await request.json();
    const { code, purpose = "ENABLE" } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Code is required" },
        { status: 400 }
      );
    }

    // Hash the provided code
    const codeHash = createHash("sha256").update(code).digest("hex");

    // Find the most recent valid, unconsumed code
    const { data: codeRecord, error } = await supabase
      .from("mfa_email_codes")
      .select("*")
      .eq("admin_id", user.id)
      .eq("code_hash", codeHash)
      .eq("purpose", purpose)
      .is("consumed_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !codeRecord) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    // Check attempts (max 5)
    if (codeRecord.attempts >= 5) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Please request a new code." },
        { status: 400 }
      );
    }

    // Mark as consumed
    const { error: updateError } = await supabase
      .from("mfa_email_codes")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", codeRecord.id);

    if (updateError) throw updateError;

    // If purpose is ENABLE, enable email MFA
    if (purpose === "ENABLE") {
      const { error: mfaError } = await supabase
        .from("admin_mfa")
        .update({
          email_otp_enabled: true,
          mfa_required: true,
          updated_at: new Date().toISOString(),
        })
        .eq("admin_id", user.id);

      if (mfaError) throw mfaError;
    }

    return NextResponse.json({
      success: true,
      message: "Email code verified successfully",
    });
  } catch (error: any) {
    console.error("Email OTP verify error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify email code" },
      { status: 500 }
    );
  }
}
