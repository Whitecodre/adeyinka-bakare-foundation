import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { baseEmailLayout } from "@/lib/email/layout";
import { logEmail, notifyAdmins } from "@/lib/email/log";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireRole(["super_admin", "admin"]);
    const body = await request.json();
    const { to, subject, html, text, template = "custom", recipients = [] } = body;
    if (!subject || (!html && !text)) return NextResponse.json({ success:false, error:"Subject and body required" }, { status:400 });

    // Resolve recipients: allow array of emails or group queries
    let targets: string[] = [];
    if (Array.isArray(recipients) && recipients.length) {
      for (const r of recipients) {
        if (r.includes("@")) targets.push(r);
        else if (r === "admins") {
          const supabase = createAdminClient();
          const { data } = await supabase.from("profiles").select("id");
          // fetch emails via auth admin list
          const adm = createAdminClient();
          const { data: users } = await adm.auth.admin.listUsers();
          const emails = (users?.users ?? []).map(u=>u.email).filter(Boolean) as string[];
          targets.push(...emails);
        } else if (r === "newsletter") {
          const supabase = createAdminClient();
          const { data } = await supabase.from("newsletter_subscribers").select("email").eq("status","subscribed");
          targets.push(...(data?.map(d=>d.email) ?? []));
        } else if (r === "members") {
          const supabase = createAdminClient();
          const { data } = await supabase.from("members").select("email").not("email","is", null);
          targets.push(...(data?.map(d=>d.email).filter(Boolean) as string[] ?? []));
        } else if (r === "volunteers") {
          const supabase = createAdminClient();
          const { data } = await supabase.from("volunteers").select("email");
          targets.push(...(data?.map(d=>d.email) ?? []));
        }
      }
    }
    if (Array.isArray(to) && to.length) targets.push(...to);
    else if (typeof to === "string" && to) targets.push(to);
    targets = [...new Set(targets.map(s=>s.toLowerCase().trim()).filter(Boolean))];
    if (!targets.length) return NextResponse.json({ success:false, error:"No recipients" }, { status:400 });

    const finalHtml = html && html.includes("<html") ? html : baseEmailLayout(html || `<p>${text || ""}</p>`, { title: subject, preheader: subject.slice(0,120) });

    let sent = 0, failed = 0;
    for (const email of targets) {
      try {
        const info = await sendEmail({ to: email, subject, html: finalHtml, text });
        await logEmail({ to_email: email, subject, template, html_preview: finalHtml, status: "sent", provider_id: (info as any)?.messageId, metadata: { studio: true }, created_by: user.id });
        sent++;
      } catch (e:any) {
        await logEmail({ to_email: email, subject, template, html_preview: finalHtml, status: "failed", error: e.message, created_by: user.id });
        failed++;
      }
    }
    await notifyAdmins({ title: `Email sent: ${subject}`, message: `Studio sent "${subject}" to ${sent} recipient(s)${failed?` (${failed} failed)`: ""}.`, type:"info", data:{ subject, sent, failed } });

    return NextResponse.json({ success:true, data:{ sent, failed, total: targets.length } });
  } catch (err:any) {
    const msg = err?.message ?? "Failed";
    return NextResponse.json({ success:false, error: msg }, { status: msg.includes("Forbidden")?403:500 });
  }
}
