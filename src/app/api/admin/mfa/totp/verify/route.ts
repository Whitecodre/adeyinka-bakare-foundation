import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { recordAdminSession } from "@/lib/auth/record-session";
import { createClient } from "@/lib/supabase/server";
import { verifyTOTP } from "@/lib/security/totp";
import { decryptTOTPSecret } from "@/lib/security/encryption";
import { hashRecoveryCode } from "@/lib/security/recovery-codes";
import { nanoid } from "nanoid";
import { sendTotpEnabledNotification, sendRecoveryCodesGeneratedNotification } from "@/lib/services/security-notifications.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const body = await request.json();
    const rawCode: string = body.code || body.token || "";
    const token = String(rawCode).trim();

    if (!token || !/^\d{6}$/.test(token)) {
      return NextResponse.json(
        { success: false, error: "Enter the 6-digit code from your authenticator app" },
        { status: 400 }
      );
    }

    const { data: mfaRow, error: mfaErr } = await supabase
      .from("admin_mfa")
      .select("encrypted_totp_secret")
      .eq("admin_id", user.id)
      .single();

    const encryptedSecret = mfaRow?.encrypted_totp_secret as string;

    if (!encryptedSecret) {
      return NextResponse.json(
        { success: false, error: "No TOTP setup found. Please start setup again." },
        { status: 400 }
      );
    }

    // Decrypt the secret
    let secret: string;
    try {
      secret = await decryptTOTPSecret(encryptedSecret);
    } catch (decryptError) {
      console.error("Failed to decrypt TOTP secret:", decryptError);
      return NextResponse.json(
        {
          success: false,
          error: "TOTP secret cannot be decrypted. This may be due to a key change. Please disable TOTP and set it up again.",
        },
        { status: 400 }
      );
    }

    // Verify the token
    const isValid = await verifyTOTP(token, secret);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid code. Check your authenticator app and try again." },
        { status: 400 }
      );
    }

    // Read existing MFA state to preserve other methods
    const { data: existingMfa } = await supabase
      .from("admin_mfa")
      .select("email_otp_enabled, passkey_enabled")
      .eq("admin_id", user.id)
      .single();

    // Use upsert to ensure row exists - preserve email OTP and passkey states
    const { error } = await supabase.rpc("upsert_admin_mfa", {
      p_admin_id: user.id,
      p_totp_enabled: true,
      p_encrypted_totp_secret: secret,
      p_email_otp_enabled: existingMfa?.email_otp_enabled ? true : null,
      p_passkey_enabled: existingMfa?.passkey_enabled ? true : null,
      p_mfa_required: true,
    });

    if (error) {
      console.error("Failed to upsert admin_mfa:", error);
      // Fallback to regular update - preserve existing email OTP and passkey states
      await supabase
        .from("admin_mfa")
        .update({
          totp_enabled: true,
          mfa_required: true,
          email_otp_enabled: existingMfa?.email_otp_enabled ?? false,
          passkey_enabled: existingMfa?.passkey_enabled ?? false,
          updated_at: new Date().toISOString(),
        })
        .eq("admin_id", user.id);
    }

    await supabase.from("mfa_recovery_codes").delete().eq("admin_id", user.id);
    const recoveryCodes = Array.from({ length: 10 }, () => nanoid(8).toUpperCase());
    const hashed = await Promise.all(
      recoveryCodes.map(async (code) => ({
        admin_id: user.id,
        code_hash: await hashRecoveryCode(code),
      }))
    );

    const { error: recoveryError } = await supabase
      .from("mfa_recovery_codes")
      .insert(hashed);

    if (recoveryError) throw recoveryError;

    // Send email notifications
    await sendTotpEnabledNotification(user.id);
    await sendRecoveryCodesGeneratedNotification(user.id);

    // Make sure the active session is recorded (covers the LOGIN flow).
    await recordAdminSession({ request, adminId: user.id });

    return NextResponse.json({
      success: true,
      data: {
        recoveryCodes,
      },
    });
  } catch (error: any) {
    console.error("TOTP verify error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify TOTP" },
      { status: 500 }
    );
  }
}
