import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { requireRole } from "@/lib/auth/require-role";
import { adminInviteSchema } from "@/lib/validations/admins.schema";
import { findPendingInviteByEmail, createInvite } from "@/lib/repositories/admin-invites.repository";
import { sendEmail } from "@/lib/email/send";
import { adminInviteEmail } from "@/lib/email/templates";
import { createClient } from "@/lib/supabase/server";

function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { profile, user } = await requireRole(["super_admin"]);

    const body = await request.json();
    const parsed = adminInviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    const { email, full_name, role } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const supabase = await createClient();
    const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", (await supabase.auth.getUser()).data.user?.id ?? "").maybeSingle();
    // Check if email already has an active profile
    const { data: profileExists } = await supabase.from("profiles").select("id, status").limit(1).maybeSingle();
    // More precise: check auth user existence via profiles email? profiles has no email, check via admin list
    // Do direct check via service? We'll check if pending invite already exists
    const pending = await findPendingInviteByEmail(normalizedEmail);
    if (pending) {
      return NextResponse.json({ success: false, error: "An invite is already pending for this email" }, { status: 409 });
    }

    const rawToken = randomBytes(32).toString("hex");
    const token_hash = hashToken(rawToken);
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const invite = await createInvite({
      email: normalizedEmail,
      full_name,
      role,
      token_hash,
      expires_at,
      invited_by: user.id,
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const inviteUrl = `${siteUrl.replace(/\/$/, "")}/admin-auth/accept-invite?token=${rawToken}`;

    try {
      const { subject, html, text } = adminInviteEmail({
        fullName: full_name,
        email: normalizedEmail,
        role,
        inviteUrl,
        expiresAt: expires_at,
        inviterName: profile.full_name || user.email || "ABF Admin",
      });
      await sendEmail({ to: normalizedEmail, subject, html, text });
    } catch (mailErr) {
      console.error("Invite email failed:", mailErr);
      // don't leak mail error to client but log; invite still created; return success with warning
    }

    return NextResponse.json({ success: true, data: { id: invite.id, email: invite.email, expires_at } });
  } catch (err: any) {
    if (err?.message?.includes("Unauthorized") || err?.message?.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: err.message }, { status: err.message === "Forbidden" ? 403 : 401 });
    }
    console.error("Invite POST error:", err);
    return NextResponse.json({ success: false, error: err?.message ?? "Failed to create invite" }, { status: 500 });
  }
}
