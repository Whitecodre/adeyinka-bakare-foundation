import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Generate TOTP secret (placeholder - using nanoid for now)
    // TODO: Implement proper TOTP with otplib once package structure is resolved
    const secret = nanoid(32).toUpperCase();

    // Build otpauth URL manually
    const otpauthUrl = `otpauth://totp/ABF Admin:${user.email || "admin"}?secret=${secret}&issuer=ABF Admin&algorithm=SHA1&digits=6&period=30`;

    // Check if MFA record exists
    const { data: existingMFA } = await supabase
      .from("admin_mfa")
      .select("*")
      .eq("admin_id", user.id)
      .single();

    if (existingMFA) {
      // Update existing record
      const { error } = await supabase
        .from("admin_mfa")
        .update({
          encrypted_totp_secret: secret, // TODO: Encrypt this in production
        })
        .eq("admin_id", user.id);

      if (error) throw error;
    } else {
      // Create new MFA record
      const { error } = await supabase
        .from("admin_mfa")
        .insert({
          admin_id: user.id,
          encrypted_totp_secret: secret, // TODO: Encrypt this in production
          totp_enabled: false, // Not enabled until verified
        });

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      data: {
        secret,
        otpauthUrl,
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
