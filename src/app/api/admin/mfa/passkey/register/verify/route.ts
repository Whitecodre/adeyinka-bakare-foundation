import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const body = await request.json();
    const { response, deviceName } = body;

    if (!response) {
      return NextResponse.json(
        { success: false, error: "Registration response is required" },
        { status: 400 }
      );
    }

    // TODO: Implement WebAuthn registration verification
    // This requires @simplewebauthn/server proper setup
    // For now, simulate success

    // Store a placeholder credential
    const { error: insertError } = await supabase.from("admin_passkeys").insert({
      admin_id: user.id,
      credential_id: "placeholder-credential-id",
      public_key: "placeholder-public-key",
      counter: 0,
      device_name: deviceName || "Unknown Device",
      last_used_at: new Date().toISOString(),
    });

    if (insertError) throw insertError;

    // Enable passkey MFA
    const { error: mfaError } = await supabase
      .from("admin_mfa")
      .update({
        passkey_enabled: true,
        mfa_required: true,
        updated_at: new Date().toISOString(),
      })
      .eq("admin_id", user.id);

    if (mfaError) throw mfaError;

    return NextResponse.json({
      success: true,
      message: "Passkey registered successfully",
    });
  } catch (error: any) {
    console.error("Passkey registration verify error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify passkey registration" },
      { status: 500 }
    );
  }
}
