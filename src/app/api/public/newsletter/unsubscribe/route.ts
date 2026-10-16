import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { logEmail, notifyAdmins } from "@/lib/email/log";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const email = parsed.data.email.toLowerCase().trim();

    const admin = createAdminClient();
    const { data: existing, error: lookupErr } = await admin
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", email)
      .maybeSingle();

    if (lookupErr) {
      return NextResponse.json({ success: false, error: lookupErr.message }, { status: 500 });
    }

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "No subscription found for that email." },
        { status: 404 }
      );
    }

    if (existing.status === "unsubscribed") {
      return NextResponse.json({ success: true, alreadyUnsubscribed: true });
    }

    const { error } = await admin
      .from("newsletter_subscribers")
      .update({ status: "unsubscribed" })
      .eq("id", existing.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      await logEmail({
        to_email: email,
        subject: "Newsletter unsubscribed",
        template: "newsletter_unsubscribed",
        status: "info",
        metadata: { subscriber_id: existing.id },
      });
    } catch {}
    try {
      await notifyAdmins({
        title: "Newsletter unsubscribed",
        message: `${email} unsubscribed from the ABF newsletter.`,
        type: "info",
        data: { email },
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("unsubscribe error", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
