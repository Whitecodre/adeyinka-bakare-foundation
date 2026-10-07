import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Get MFA settings
    const { data: mfa, error } = await supabase
      .from("admin_mfa")
      .select("*")
      .eq("admin_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = not found, which is OK for new users
      throw error;
    }

    // Get passkeys count
    const { count: passkeyCount } = await supabase
      .from("admin_passkeys")
      .select("*", { count: "exact", head: true })
      .eq("admin_id", user.id);

    // Get recovery codes count
    const { count: recoveryCodesCount } = await supabase
      .from("mfa_recovery_codes")
      .select("*", { count: "exact", head: true })
      .eq("admin_id", user.id)
      .is("used_at", null);

    return NextResponse.json({
      success: true,
      data: {
        mfaEnabled: mfa?.mfa_required || false,
        totpEnabled: mfa?.totp_enabled || false,
        emailOtpEnabled: mfa?.email_otp_enabled || false,
        passkeyEnabled: mfa?.passkey_enabled || false,
        passkeyCount: passkeyCount || 0,
        recoveryCodesCount: recoveryCodesCount || 0,
        hasAnyMFA: (mfa?.totp_enabled || mfa?.email_otp_enabled || mfa?.passkey_enabled) || false,
      },
    });
  } catch (error: any) {
    console.error("MFA status error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get MFA status" },
      { status: 500 }
    );
  }
}
