import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";

const RP_ID = process.env.WEBAUTHN_RP_ID ?? 'localhost';
const RP_NAME = process.env.WEBAUTHN_RP_NAME ?? 'ABF Admin';
const ORIGIN = process.env.WEBAUTHN_ORIGIN ?? 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Use environment variables or fallback to origin
    const origin = request.headers.get("origin") || request.nextUrl.origin || ORIGIN;
    let rpID = RP_ID;
    try {
      const url = new URL(origin);
      rpID = url.hostname;
    } catch {}
    if (rpID === "127.0.0.1") rpID = "localhost";

    const { data: existing } = await supabase
      .from("admin_passkeys")
      .select("credential_id")
      .eq("admin_id", user.id);

    const excludeCredentials = (existing || []).map((r: any) => ({
      id: r.credential_id,
      type: "public-key" as const,
    }));

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID,
      userID: new TextEncoder().encode(user.id),
      userName: user.email || user.id,
      userDisplayName: user.email || "ABF Admin",
      attestationType: "none",
      excludeCredentials,
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform",
      },
      supportedAlgorithmIDs: [-7, -257],
    });

    await supabase.from("webauthn_challenges").insert({
      user_id: user.id,
      challenge: options.challenge,
      type: "REGISTRATION",
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: options,
    });
  } catch (error: any) {
    console.error("Passkey registration options error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate registration options" },
      { status: 500 }
    );
  }
}
