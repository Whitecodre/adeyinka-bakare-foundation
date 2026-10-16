import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { createHash } from "crypto";
import { sendEmail } from "@/lib/email/send";
import { otpEmail } from "@/lib/email/templates";
import { getSettings } from "@/lib/services/settings.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const body = await request.json();
    const { purpose = "ENABLE" } = body; // ENABLE, LOGIN

    // Fetch site settings for logo
    const settings = await getSettings();

    // Check rate limit: max 2 sends within 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    const { data: recentCodes, error: countError } = await supabase
      .from("mfa_email_codes")
      .select("*")
      .eq("admin_id", user.id)
      .eq("purpose", purpose)
      .gte("created_at", tenMinutesAgo);

    if (countError) throw countError;

    if (recentCodes && recentCodes.length >= 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many email codes sent. Please wait 10 minutes before requesting another.",
        },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = createHash("sha256").update(code).digest("hex");

    // Store in database with 10-minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error } = await supabase.from("mfa_email_codes").insert({
      admin_id: user.id,
      code_hash: codeHash,
      purpose,
      expires_at: expiresAt,
    });

    if (error) throw error;

    // Send email with the code
    // Email is in auth.users, not profiles
    const email = user.email;

    if (email) {
      const emailTemplate = otpEmail({
        fullName: user.user_metadata?.full_name || user.user_metadata?.name || "Admin",
        code,
        purpose,
        logoUrl: settings.logo,
      });

      try {
        await sendEmail({
          to: email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
    } else {
      console.error("No email found for user");
    }

    return NextResponse.json({
      success: true,
      message: "Email code sent successfully",
    });
  } catch (error: any) {
    console.error("Email OTP send error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send email code" },
      { status: 500 }
    );
  }
}
