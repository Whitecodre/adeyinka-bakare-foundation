import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { newsletterEmail } from "@/lib/email/templates";
import { logEmail, notifyAdmins } from "@/lib/email/log";

const schema = z.object({
  email: z.string().email(),
  full_name: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success:false, error: parsed.error.issues[0].message }, { status:400 });
    const { email, full_name, source } = parsed.data;
    const normalized = email.toLowerCase().trim();

    const supabase = createAdminClient();
    const { data: existing } = await supabase.from("newsletter_subscribers").select("id, status").eq("email", normalized).maybeSingle();
    if (existing && existing.status === "subscribed") {
      return NextResponse.json({ success:true, message:"Already subscribed" });
    }

    const { data, error } = await supabase.from("newsletter_subscribers").upsert({
      email: normalized,
      full_name: full_name || null,
      status: "subscribed",
      source: source || "footer",
    }, { onConflict: "email" }).select().single();
    if (error) throw error;

    // Welcome email via Zoho with reusable layout
    try {
      const { subject, html, text } = newsletterEmail({
        title: "You're subscribed — welcome to ABF!",
        excerpt: "Thanks for joining Adeyinka Bakare Foundation. You'll get scholarship, programme and event updates.",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://adeyinkabakare.org",
        recipientEmail: normalized,
        fullName: full_name,
      });
      const info = await sendEmail({ to: normalized, subject, html, text });
      await logEmail({ to_email: normalized, to_name: full_name, subject, template:"newsletter_welcome", html_preview: html, status:"sent", provider_id: (info as any)?.messageId, metadata:{ source } });
    } catch (e:any) {
      await logEmail({ to_email: normalized, subject:"Newsletter welcome", template:"newsletter_welcome", status:"failed", error: e.message });
    }

    await notifyAdmins({ title:"New newsletter subscriber", message:`${normalized} subscribed via ${source || "footer"}`, type:"info", data:{ email: normalized } });

    return NextResponse.json({ success:true, data });
  } catch (err:any) {
    console.error("newsletter error", err);
    return NextResponse.json({ success:false, error: err.message || "Failed" }, { status:500 });
  }
}

export async function GET() {
  return NextResponse.json({ success:false, error:"Use POST" }, { status:405 });
}
