import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { recordAdminSession } from "@/lib/auth/record-session";
import { createClient } from "@/lib/supabase/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";

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

    const origin = request.headers.get("origin") || request.nextUrl.origin;
    let rpID = "localhost";
    try { rpID = new URL(origin).hostname; } catch {}
    if (rpID === "127.0.0.1") rpID = "localhost";

    const { data: challengeRow, error: chalErr } = await supabase
      .from("webauthn_challenges")
      .select("*")
      .eq("user_id", user.id)
      .eq("type", "AUTHENTICATION")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (chalErr || !challengeRow) {
      return NextResponse.json({ success: false, error: "No valid authentication challenge. Please try again." }, { status: 400 });
    }

    const credentialID = response.id as string;
    // console.log("Authenticating passkey with credential ID:", credentialID);

    const { data: passkey, error: pkErr } = await supabase
      .from("admin_passkeys")
      .select("*")
      .eq("credential_id", credentialID)
      .eq("admin_id", user.id)
      .maybeSingle();

    // console.log("Passkey found:", passkey);
    console.log("Passkey error:", pkErr);

    if (pkErr || !passkey) {
      return NextResponse.json({ success: false, error: "Passkey not found" }, { status: 400 });
    }

    // Supabase text column stores base64url string (like WORKNOW)
    let publicKeyBytes: Uint8Array;
    const rawKey: any = (passkey as any).public_key;
    // console.log("Raw public_key type:", typeof rawKey);
    // console.log("Raw public_key:", rawKey);
    try {
      if (rawKey instanceof Uint8Array) {
        publicKeyBytes = rawKey;
      } else if (typeof rawKey === "string") {
        // Decode from base64url string (our new format)
        const decoded = Buffer.from(rawKey, 'base64url');
        // console.log("Decoded as base64url, length:", decoded.length);
        publicKeyBytes = new Uint8Array(decoded);
      } else if (rawKey && typeof rawKey === "object" && Array.isArray((rawKey as any).data)) {
        // Buffer object with data array
        publicKeyBytes = new Uint8Array((rawKey as any).data);
      } else if (rawKey && typeof rawKey === "object") {
        // Other object type
        publicKeyBytes = new Uint8Array(Buffer.from(rawKey as any));
      } else {
        // Last resort
        publicKeyBytes = new Uint8Array(Buffer.from(rawKey as any));
      }
    } catch (e) {
      console.error("Failed to decode publicKey for", credentialID, "rawKey type:", typeof rawKey, "rawKey:", rawKey, "error:", e);
      // DON'T delete the passkey - log the error instead for debugging
      return NextResponse.json({ success: false, error: "Failed to decode passkey public key. Please check server logs." }, { status: 500 });
    }

    // console.log("Final decoded public key length:", publicKeyBytes.length);

    if (publicKeyBytes.length < 32) {
      console.error("Public key too short:", publicKeyBytes.length);
      // DON'T delete - let user know to re-register
      return NextResponse.json({ success: false, error: "Passkey public key appears invalid. Please delete and re-register this passkey." }, { status: 400 });
    }

    // Remove the base64url check - we intentionally store as base64url

    const credentialForVerify: any = {
      id: passkey.credential_id,
      publicKey: Buffer.from(publicKeyBytes),
      counter: Number(passkey.counter) || 0,
    };

    // console.log("Credential for verify:", {
    //   id: credentialForVerify.id,
    //   publicKeyLength: credentialForVerify.publicKey.length,
    //   counter: credentialForVerify.counter,
    // });

    const verification = await verifyAuthenticationResponse({
      response: response as any,
      expectedChallenge: challengeRow.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: credentialForVerify,
      requireUserVerification: false,
    });

    if (!verification.verified) {
      return NextResponse.json({ success: false, error: "Passkey verification failed" }, { status: 400 });
    }

    await supabase.from("webauthn_challenges").delete().eq("id", challengeRow.id);
    await supabase.from("admin_passkeys").update({
      counter: verification.authenticationInfo.newCounter,
      last_used_at: new Date().toISOString(),
    }).eq("id", passkey.id);

    await supabase.from("admin_mfa").update({ updated_at: new Date().toISOString() }).eq("admin_id", user.id);

    // Make sure the active session is recorded (covers the LOGIN flow).
    await recordAdminSession({ request, adminId: user.id });

    return NextResponse.json({
      success: true,
      message: "Passkey authentication successful",
    });
  } catch (error: any) {
    console.error("Passkey authentication verify error:", error);
    const msg = error?.message || "Failed to verify passkey authentication";
    if (msg.includes("Length") || msg.includes("well formed")) {
      return NextResponse.json(
        { success: false, error: "This passkey data is corrupted (stored incorrectly). Please go to /admin/security — the broken entry will be auto-removed — and register a new Windows Hello passkey." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
