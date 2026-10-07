import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

const RP_ID = process.env.WEBAUTHN_RP_ID || "localhost";
const RP_NAME = process.env.WEBAUTHN_RP_NAME || "ABF Admin";
const ORIGIN = process.env.WEBAUTHN_ORIGIN || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Get user's passkeys
    const { data: passkeys } = await supabase
      .from("admin_passkeys")
      .select("credential_id")
      .eq("admin_id", user.id);

    if (!passkeys || passkeys.length === 0) {
      return NextResponse.json(
        { success: false, error: "No passkeys registered" },
        { status: 400 }
      );
    }

    const allowCredentials = passkeys.map((pk) => ({
      id: pk.credential_id,
      type: "public-key",
    }));

    // Generate authentication options
    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      userVerification: "preferred",
      allowCredentials,
    });

    // Store challenge
    const { error } = await supabase.from("webauthn_challenges").insert({
      user_id: user.id,
      challenge: options.challenge,
      type: "AUTHENTICATION",
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });

    if (error) {
      console.error("Failed to store challenge:", error);
    }

    return NextResponse.json({
      success: true,
      data: options,
    });
  } catch (error: any) {
    console.error("Passkey authentication options error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate authentication options" },
      { status: 500 }
    );
  }
}
