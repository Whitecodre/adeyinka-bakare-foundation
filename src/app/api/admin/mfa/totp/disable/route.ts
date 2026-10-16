import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { sendTotpDisabledNotification } from "@/lib/services/security-notifications.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Delete recovery codes
    await supabase.from("mfa_recovery_codes").delete().eq("admin_id", user.id);

    // Read existing MFA state to preserve other methods
    const { data: existingMfa } = await supabase
      .from("admin_mfa")
      .select("email_otp_enabled, passkey_enabled")
      .eq("admin_id", user.id)
      .single();

    const hasOtherMfa = (existingMfa?.email_otp_enabled || existingMfa?.passkey_enabled || false);

    // Disable TOTP by updating the admin_mfa record using upsert - preserve email OTP and passkey states
    const { error } = await supabase.rpc("upsert_admin_mfa", {
      p_admin_id: user.id,
      p_totp_enabled: false,
      p_encrypted_totp_secret: null,
      p_email_otp_enabled: existingMfa?.email_otp_enabled ? true : null,
      p_passkey_enabled: existingMfa?.passkey_enabled ? true : null,
      p_mfa_required: hasOtherMfa,
    });

    if (error) {
      console.error("Failed to upsert admin_mfa:", error);
      // Fallback to regular update - preserve email OTP and passkey states
      await supabase
        .from("admin_mfa")
        .update({
          totp_enabled: false,
          encrypted_totp_secret: null,
          email_otp_enabled: existingMfa?.email_otp_enabled ?? false,
          passkey_enabled: existingMfa?.passkey_enabled ?? false,
          mfa_required: hasOtherMfa,
        })
        .eq("admin_id", user.id);
    }

    // Send email notification
    await sendTotpDisabledNotification(user.id);

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