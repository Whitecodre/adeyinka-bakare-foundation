import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Read existing MFA state to preserve other methods
    const { data: existingMfa } = await supabase
      .from("admin_mfa")
      .select("totp_enabled, passkey_enabled")
      .eq("admin_id", user.id)
      .single();

    const hasOtherMfa = (existingMfa?.totp_enabled || existingMfa?.passkey_enabled || false);

    // Disable email OTP by updating the admin_mfa record using upsert - preserve TOTP and passkey states
    const { error } = await supabase.rpc("upsert_admin_mfa", {
      p_admin_id: user.id,
      p_email_otp_enabled: false,
      p_totp_enabled: existingMfa?.totp_enabled ? true : null,
      p_passkey_enabled: existingMfa?.passkey_enabled ? true : null,
      p_mfa_required: hasOtherMfa,
    });

    if (error) {
      console.error("Failed to upsert admin_mfa:", error);
      // Fallback to regular update - preserve TOTP and passkey states
      await supabase
        .from("admin_mfa")
        .update({
          email_otp_enabled: false,
          totp_enabled: existingMfa?.totp_enabled ?? false,
          passkey_enabled: existingMfa?.passkey_enabled ?? false,
          mfa_required: hasOtherMfa,
        })
        .eq("admin_id", user.id);
    }

    return NextResponse.json({
      success: true,
      message: "Email OTP disabled successfully",
    });
  } catch (error) {
    console.error("Email OTP disable error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to disable email OTP" },
      { status: 500 }
    );
  }
}
