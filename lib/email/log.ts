import { createAdminClient } from "@/lib/supabase/admin";

export async function logEmail(opts: {
  to_email: string;
  to_name?: string;
  subject: string;
  template: string;
  html_preview?: string;
  status?: string;
  provider_id?: string;
  metadata?: Record<string, unknown>;
  created_by?: string | null;
  error?: string | null;
}) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("email_logs").insert({
      to_email: opts.to_email,
      to_name: opts.to_name || null,
      subject: opts.subject,
      template: opts.template,
      html_preview: opts.html_preview ? opts.html_preview.slice(0, 8000) : null,
      status: (opts.status as any) || "sent",
      provider: "zoho",
      provider_id: opts.provider_id || null,
      metadata: (opts.metadata as any) || {},
      created_by: opts.created_by || null,
      error: opts.error || null,
    });
    if (error) console.error("email log failed", error.message);
  } catch (e) {
    console.error("logEmail exception", e);
  }
}

export async function notifyAdmins(opts: {
  title: string;
  message: string;
  type?: string;
  data?: Record<string, unknown>;
}) {
  try {
    const supabase = createAdminClient();
    const { data: admins } = await supabase.from("profiles").select("id").in("role", ["super_admin", "admin"]);
    if (!admins?.length) return;
    const rows = admins.map(a => ({
      recipient_id: a.id,
      type: opts.type || "info",
      title: opts.title,
      message: opts.message,
      data: opts.data || {},
    }));
    const { error } = await supabase.from("notifications").insert(rows);
    if (error) console.error("notifyAdmins failed", error.message);
  } catch (e) { console.error(e); }
}
