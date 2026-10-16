import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service-client";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { sendPasskeyAddedNotification } from "@/lib/services/security-notifications.service";

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

    // Use service client to bypass RLS for passkey insertion
    const serviceSupabase = await createServiceClient();

    // Store as base64url string (like WORKNOW does) - when retrieved, Supabase bytea will return hex format
    const { error: insertError } = await serviceSupabase.from("admin_passkeys").insert({
      admin_id: user.id,
      credential_id: credentialID,
      public_key: credentialPublicKey.toString('base64url'),
      counter,
      device_name: deviceName || `${credentialDeviceType || "Passkey"}${credentialBackedUp ? " (synced)" : ""}`.trim() || "My passkey",
      last_used_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Passkey insert error:", insertError);
      console.error("Error details:", JSON.stringify(insertError, null, 2));
      throw insertError;
    }

    console.log("Passkey inserted successfully");

    // Enable passkey MFA - use upsert to handle case where row doesn't exist
    const { error: mfaError } = await supabase.rpc("upsert_admin_mfa", {
      p_admin_id: user.id,
      p_passkey_enabled: true,
      p_mfa_required: true,
    });

    if (mfaError) {
      console.error("Failed to upsert admin_mfa:", mfaError);
      // Fallback to regular update if upsert doesn't exist
      await supabase
        .from("admin_mfa")
        .update({
          passkey_enabled: true,
          mfa_required: true,
          updated_at: new Date().toISOString(),
        })
        .eq("admin_id", user.id);
    }

    // Send email notification
    const finalDeviceName = deviceName || `${credentialDeviceType || "Passkey"}${credentialBackedUp ? " (synced)" : ""}`.trim() || "My passkey";
    await sendPasskeyAddedNotification(user.id, finalDeviceName);

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
