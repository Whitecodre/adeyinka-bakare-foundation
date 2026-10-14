import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { verifyTOTP } from "@/lib/security/totp";
import { hashRecoveryCode } from "@/lib/security/recovery-codes";

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

    if (mfaErr || !mfaRow?.encrypted_totp_secret) {
      return NextResponse.json(
        { success: false, error: "No TOTP setup found. Please start setup again." },
        { status: 400 }
      );
    }

    const secret = mfaRow.encrypted_totp_secret as string;
    const isValid = await verifyTOTP(token, secret);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid code. Check your authenticator app and try again." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("admin_mfa")
      .update({
        totp_enabled: true,
        mfa_required: true,
        updated_at: new Date().toISOString(),
      })
      .eq("admin_id", user.id);

    if (error) throw error;

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
