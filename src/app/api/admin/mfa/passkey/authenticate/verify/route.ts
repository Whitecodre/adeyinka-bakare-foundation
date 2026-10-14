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

    // Supabase bytea can come back as string (\x...), Buffer object {type:'Buffer',data:[...]}, or Uint8Array
    let publicKeyBytes: Uint8Array;
    const rawKey: any = (passkey as any).public_key;
    try {
      if (rawKey instanceof Uint8Array) {
        publicKeyBytes = rawKey;
      } else if (typeof rawKey === "string") {
        if (rawKey.startsWith("\\x")) {
          publicKeyBytes = new Uint8Array(Buffer.from(rawKey.slice(2), "hex"));
        } else if (rawKey.startsWith("0x")) {
          publicKeyBytes = new Uint8Array(Buffer.from(rawKey.slice(2), "hex"));
        } else {
          // try base64, then hex fallback
          try {
            publicKeyBytes = new Uint8Array(Buffer.from(rawKey, "base64"));
            if (publicKeyBytes.length < 32) throw new Error("short");
          } catch {
            publicKeyBytes = new Uint8Array(Buffer.from(rawKey, "hex"));
          }
        }
      } else if (rawKey && typeof rawKey === "object" && Array.isArray((rawKey as any).data)) {
        publicKeyBytes = new Uint8Array((rawKey as any).data);
      } else if (rawKey && typeof rawKey === "object") {
        publicKeyBytes = new Uint8Array(Buffer.from(rawKey as any));
      } else {
        publicKeyBytes = new Uint8Array(Buffer.from(rawKey as any));
      }
    } catch (e) {
      console.error("Failed to decode publicKey for", credentialID, e);
      return NextResponse.json({ success: false, error: "Passkey data is corrupted. Please delete this passkey and re-register." }, { status: 400 });
    }

    if (publicKeyBytes.length < 32) {
      await supabase.from("admin_passkeys").delete().eq("id", passkey.id);
      return NextResponse.json({ success: false, error: "Old placeholder passkey removed. Please register a new passkey in /admin/security." }, { status: 400 });
    }
    // Detect broken base64url-string-stored-as-bytea (from one bad deploy where we stored b64url text as bytea)
    try {
      const asUtf8 = Buffer.from(publicKeyBytes).toString("utf8");
      if (/^[A-Za-z0-9_-]{50,}$/.test(asUtf8) && asUtf8.length < 300) {
        await supabase.from("admin_passkeys").delete().eq("id", passkey.id);
        return NextResponse.json({ success: false, error: "Passkey was stored incorrectly and has been removed. Please register a new passkey in /admin/security (Windows Hello will be offered)." }, { status: 400 });
      }
    } catch {}

    const credentialForVerify: any = {
      id: passkey.credential_id,
      publicKey: publicKeyBytes,
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
