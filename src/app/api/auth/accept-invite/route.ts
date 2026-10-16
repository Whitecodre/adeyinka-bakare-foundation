import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { acceptInviteSchema } from "@/lib/validations/admins.schema";
import { findInviteByTokenHash, markInviteAccepted } from "@/lib/repositories/admin-invites.repository";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { welcomeEmail } from "@/lib/email/templates";

function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = acceptInviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    const { token, password } = parsed.data;
    const hash = hashToken(token);
    const invite = await findInviteByTokenHash(hash);
    if (!invite) return NextResponse.json({ success: false, error: "Invalid or expired invite" }, { status: 410 });
    if (invite.accepted_at) return NextResponse.json({ success: false, error: "Invite already accepted" }, { status: 410 });
    if (new Date(invite.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ success: false, error: "Invite has expired" }, { status: 410 });
    }

    const supabaseAdmin = createAdminClient();
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: invite.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: invite.full_name },
    });
    if (createErr) {
      // If user already exists, surface cleanly
      return NextResponse.json({ success: false, error: createErr.message }, { status: 400 });
    }
    const userId = created.user.id;
    const { error: profileErr } = await supabaseAdmin.from("profiles").insert({
      id: userId,
      full_name: invite.full_name,
      role: invite.role,
      status: "active",
    });
    if (profileErr) {
      // rollback auth user
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ success: false, error: profileErr.message }, { status: 500 });
    }

    await markInviteAccepted(invite.id);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    try {
      const { subject, html, text } = welcomeEmail({ fullName: invite.full_name, loginUrl: `${siteUrl.replace(/\/$/, "")}/admin-auth/login` });
      await sendEmail({ to: invite.email, subject, html, text });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("accept-invite error:", err);
    return NextResponse.json({ success: false, error: err?.message ?? "Failed" }, { status: 500 });
  }
}

// GET helper to validate token without consuming (for page pre-check)
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  if (!token) return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 });
  const hash = hashToken(token);
  const invite = await findInviteByTokenHash(hash);
  if (!invite) return NextResponse.json({ success: false, error: "Invalid invite" }, { status: 410 });
  if (invite.accepted_at) return NextResponse.json({ success: false, error: "Already accepted" }, { status: 410 });
  if (new Date(invite.expires_at).getTime() < Date.now()) return NextResponse.json({ success: false, error: "Expired" }, { status: 410 });
  return NextResponse.json({ success: true, data: { email: invite.email, full_name: invite.full_name, role: invite.role, expires_at: invite.expires_at } });
}
