import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { generateTOTPSetup } from "@/lib/security/totp";
import { encryptTOTPSecret } from "@/lib/security/encryption";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Generate TOTP secret using otplib
    const { secret, qrCodeUrl, otpauthUrl } = await generateTOTPSetup(user.email || "admin");

    // Encrypt the secret before storing
    const encryptedSecret = await encryptTOTPSecret(secret);

    // Use upsert to ensure row exists and store the encrypted secret
    const { error } = await supabase.rpc("upsert_admin_mfa", {
      p_admin_id: user.id,
      p_encrypted_totp_secret: encryptedSecret,
      p_totp_enabled: false, // Not enabled until verified
    });

    if (error) {
      console.error("Failed to upsert admin_mfa:", error);
      // Fallback to manual upsert
      const { data: existingMFA } = await supabase
        .from("admin_mfa")
        .select("*")
        .eq("admin_id", user.id)
        .single();

      if (existingMFA) {
        await supabase
          .from("admin_mfa")
          .update({ encrypted_totp_secret: encryptedSecret })
          .eq("admin_id", user.id);
      } else {
        await supabase
          .from("admin_mfa")
          .insert({
            admin_id: user.id,
            encrypted_totp_secret: encryptedSecret,
            totp_enabled: false,
          });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        secret,
        otpauthUrl,
        qrCodeUrl,
      },
    });
  } catch (error: any) {
    console.error("TOTP setup error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to setup TOTP" },
      { status: 500 }
    );
  }
}
