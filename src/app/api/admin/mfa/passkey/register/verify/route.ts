import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";

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

    const origin = request.headers.get("origin") || request.nextUrl.origin;
    let rpID = "localhost";
    try { rpID = new URL(origin).hostname; } catch {}
    if (rpID === "127.0.0.1") rpID = "localhost";

    const { data: challengeRow, error: chalErr } = await supabase
      .from("webauthn_challenges")
      .select("*")
      .eq("user_id", user.id)
      .eq("type", "REGISTRATION")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (chalErr || !challengeRow) {
      return NextResponse.json({ success: false, error: "No valid registration challenge found. Please try again." }, { status: 400 });
    }

    const verification = await verifyRegistrationResponse({
      response: response as any,
      expectedChallenge: challengeRow.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ success: false, error: "Passkey verification failed" }, { status: 400 });
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
    const credentialID = credential.id;
    const credentialPublicKey = Buffer.from(credential.publicKey);
    const counter = credential.counter;

    await supabase.from("webauthn_challenges").delete().eq("id", challengeRow.id);

    const { error: insertError } = await supabase.from("admin_passkeys").insert({
      admin_id: user.id,
      credential_id: credentialID,
      public_key: credentialPublicKey,
      counter,
      device_name: deviceName || `${credentialDeviceType || "Passkey"}${credentialBackedUp ? " (synced)" : ""}`.trim() || "My passkey",
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
