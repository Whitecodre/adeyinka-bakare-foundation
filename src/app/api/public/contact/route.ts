import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email/send";
import { adminNotifyEmail } from "@/lib/email/templates";
import { logEmail, notifyAdmins } from "@/lib/email/log";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const schema = z.object({ name: z.string().min(1), email: z.string().email(), subject: z.string().optional(), message: z.string().min(5) });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    const { name, email, subject, message } = parsed.data;
    const adminSubject = `New contact: ${subject || name}`;
    try {
      const { subject: s, html, text } = adminNotifyEmail({ title: adminSubject, message: `${name} -- ${email}: ${message.slice(0,120)}`, ctaUrl: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/notifications`, ctaLabel: "View notifications" });
      await notifyAdmins({ title: adminSubject, message, type: "contact", data: { email, name } });
      try {
        const info: any = await sendEmail({ to: process.env.SMTP_FROM || process.env.SMTP_USER!, subject: s, html, text });
        await logEmail({ to_email: process.env.SMTP_FROM || process.env.SMTP_USER!, subject: s, template: "contact_admin_notify", html_preview: html, status: "sent", provider_id: info?.messageId, metadata: { email, name } });
      } catch {}
      try {
        const reply = adminNotifyEmail({ title: "We received your message", message: `Hi ${name}, thanks for contacting ABF -- we will reply shortly.` });
        const info2: any = await sendEmail({ to: email, subject: reply.subject, html: reply.html, text: reply.text });
        await logEmail({ to_email: email, to_name: name, subject: reply.subject, template: "contact_auto_reply", html_preview: reply.html, status: "sent", provider_id: info2?.messageId });
      } catch {}
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
