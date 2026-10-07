import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const body = await request.json();
    const { token, secret } = body;

    if (!token || !secret) {
      return NextResponse.json(
        { success: false, error: "Token and secret are required" },
        { status: 400 }
      );
    }

    // Verify TOTP token (placeholder - accept any 6-digit code for now)
    // TODO: Implement proper TOTP verification with otplib
    const isValid = token.length === 6 && /^\d+$/.test(token);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid TOTP token" },
        { status: 400 }
      );
    }

    // Enable TOTP in database
    const { error } = await supabase
      .from("admin_mfa")
      .update({
        totp_enabled: true,
        mfa_required: true,
        updated_at: new Date().toISOString(),
      })
      .eq("admin_id", user.id);

    if (error) throw error;

    // Generate recovery codes
    const recoveryCodes = Array.from({ length: 10 }, () =>
      nanoid(8).toUpperCase()
    );

    // Hash and store recovery codes
    const { error: recoveryError } = await supabase
      .from("mfa_recovery_codes")
      .insert(
        recoveryCodes.map((code) => ({
          admin_id: user.id,
          code_hash: code, // TODO: Hash this in production
        }))
      );

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
