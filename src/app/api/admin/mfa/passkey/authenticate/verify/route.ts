import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
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
    const { data: passkey, error: pkErr } = await supabase
      .from("admin_passkeys")
      .select("*")
      .eq("credential_id", credentialID)
      .eq("admin_id", user.id)
      .maybeSingle();

    if (pkErr || !passkey) {
      return NextResponse.json({ success: false, error: "Passkey not found" }, { status: 400 });
    }

    // Supabase stores public_key as bytea / Buffer; convert to Uint8Array base64url as expected by simplewebauthn
    const publicKey = (passkey.public_key as unknown as Uint8Array) || (passkey as any).public_key;
    const credentialForVerify: any = {
      id: passkey.credential_id,
      publicKey: publicKey instanceof Uint8Array ? publicKey : new Uint8Array(Buffer.from(publicKey as any)),
      counter: Number(passkey.counter) || 0,
    };

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
