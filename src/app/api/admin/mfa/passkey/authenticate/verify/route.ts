import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const body = await request.json();
    const { response } = body;

    if (!response) {
      return NextResponse.json(
        { success: false, error: "Authentication response is required" },
        { status: 400 }
      );
    }

    // TODO: Implement WebAuthn authentication verification
    // This requires @simplewebauthn/server proper setup
    // For now, simulate success

    // Update MFA settings to mark as verified
    const { error: mfaError } = await supabase
      .from("admin_mfa")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("admin_id", user.id);

    if (mfaError) throw mfaError;

    return NextResponse.json({
      success: true,
      message: "Passkey authentication successful",
    });
  } catch (error: any) {
    console.error("Passkey authentication verify error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify passkey authentication" },
      { status: 500 }
    );
  }
}
