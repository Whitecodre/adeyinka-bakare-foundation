"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, Eye, Mail, Clock, CheckCircle2 } from "lucide-react";

const GROUPS = [
  { value: "admins", label: "All Admins" },
  { value: "members", label: "All Members (with email)" },
  { value: "volunteers", label: "All Volunteers" },
  { value: "newsletter", label: "Newsletter Subscribers" },
];

export default function EmailStudioPage() {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("<p>Hello {{name}},</p><p>We have an update for you from ABF.</p>");
  const [customTo, setCustomTo] = useState("");
  const [groups, setGroups] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = async () => {
    const r = await fetch("/api/admin/email/logs").then(v=>v.json());
    if (r.success) setLogs(r.data);
  };
  useEffect(()=>{ fetchLogs(); }, []);

  const rawLogoPreview = (typeof process !== "undefined" && ((process.env as any).NEXT_PUBLIC_EMAIL_LOGO_URL || "https://ibb.co/LhSBgzZK")) || "https://ibb.co/LhSBgzZK";
  const isPageUrl = rawLogoPreview.includes("ibb.co/LhSBgzZK") && !/\.(png|jpe?g|webp|svg)/i.test(rawLogoPreview);
  const logoPreview = isPageUrl ? "/brand/logo.png" : rawLogoPreview.replace("ibb.co/", "i.ibb.co/");
  const previewHtml = `<!doctype html><html><body style="margin:0;padding:12px;background:#FFFBF8;font-family:Inter,Arial,sans-serif">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e8ddd0">
    <div style="background:#2d1816;padding:14px 20px;color:#fff"><table cellpadding="0" cellspacing="0" width="100%"><tr><td style="vertical-align:middle"><table cellpadding="0" cellspacing="0"><tr><td style="padding-right:8px"><img src="${logoPreview}" alt="ABF logo" width="32" height="32" style="display:block;width:32px;height:32px;border-radius:8px;background:#fff;object-fit:cover" onerror="this.onerror=null;this.src='/brand/logo.png'" /></td><td><div style="font-weight:900;letter-spacing:.12em;font-size:13px;line-height:1">ABF</div><div style="color:#f8c84d;font-size:9px;letter-spacing:.08em">ADEYINKA BAKARE FOUNDATION</div></td></tr></table></td><td align="right" style="font-size:10px;opacity:.8">Visit website →</td></tr></table></div>
    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="ABF scholars graduating -- empowering IT students" style="width:100%;height:160px;object-fit:cover;display:block" />
    <div style="padding:20px"><h2 style="margin:0 0 8px;font-family:Georgia,serif;color:#2d1816">${subject || "Preview subject"}</h2><div style="color:#2d1816;font-size:13px;line-height:1.6">${body}</div></div>
    <div style="background:#fff9eb;padding:12px 20px;border-top:1px solid #f0e6d8;font-size:11px;color:#6b5b55;text-align:center">© ${new Date().getFullYear()} ABF · Empowering Futures, Transforming Lives</div>
  </div></body></html>`;

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) { toast({ variant:"destructive", title:"Subject and body required"}); return; }
    const recipients = [...groups];
    if (customTo.trim()) recipients.push(...customTo.split(/[,\s]+/).filter(Boolean));
    if (!recipients.length) { toast({ variant:"destructive", title:"Add at least one recipient or group"}); return; }
    setSending(true);
    try {
      const res = await fetch("/api/admin/email/send", { method:"POST", headers:{ "Content-Type":"application/json"}, body: JSON.stringify({ subject, html: body, recipients }) });
      const j = await res.json();
      if (!j.success) throw new Error(j.error);
      toast({ title:`Sent to ${j.data.sent} recipient(s)`, description: j.data.failed?`${j.data.failed} failed`:"Done" });
      fetchLogs();
    } catch(e:any){ toast({ variant:"destructive", title:"Failed", description:e.message}); }
    finally { setSending(false); }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Email Studio" subtitle="Send on-brand emails with header/footer — logged and notified" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border-border">
          <CardHeader><CardTitle className="text-sm flex gap-2 items-center"><Mail className="size-4"/> Compose</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="flex flex-wrap gap-2">
                {GROUPS.map(g=>(
                  <label key={g.value} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs cursor-pointer ${groups.includes(g.value)?"bg-ink text-white border-ink":"bg-card"}`}>
                    <input type="checkbox" className="sr-only" checked={groups.includes(g.value)} onChange={e=> setGroups(prev=> e.target.checked? [...prev,g.value]: prev.filter(v=>v!==g.value))} />
                    {g.label}
                  </label>
                ))}
              </div>
              <Input placeholder="Custom emails, comma separated" value={customTo} onChange={e=>setCustomTo(e.target.value)} />
            </div>
            <div className="space-y-2"><Label>Subject</Label><Input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="e.g. ABF Newsletter — May update" /></div>
            <div className="space-y-2"><Label>Content (HTML allowed)</Label><Textarea value={body} onChange={e=>setBody(e.target.value)} rows={8} className="font-mono text-xs" /></div>
            <Button variant="brand" onClick={handleSend} disabled={sending} className="w-full"><Send className="size-4"/>{sending?"Sending...":"Send email"}</Button>
          </CardContent>
        </Card>
        <Card className="border-border overflow-hidden">
          <CardHeader><CardTitle className="text-sm flex gap-2 items-center"><Eye className="size-4"/> Live preview (header + footer + Unsplash hero + background)</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="bg-sand p-3">
              <iframe title="preview" srcDoc={previewHtml} className="w-full h-[520px] rounded-xl border bg-white" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="border-border">
        <CardHeader><CardTitle className="text-sm flex gap-2 items-center"><Clock className="size-4"/> Recent sends <Badge variant="secondary">{logs.length}</Badge></CardTitle></CardHeader>
        <CardContent>
          {logs.length===0? <p className="text-sm text-muted-foreground">No emails sent yet.</p> : (
            <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
              {logs.map(l=>(
                <div key={l.id} className="flex gap-3 items-center rounded-xl border border-border p-3 bg-card">
                  <div className={`size-8 rounded-full grid place-items-center ${l.status==="sent"?"bg-emerald-100 text-emerald-700":"bg-destructive/10 text-destructive"}`}>{l.status==="sent"?<CheckCircle2 className="size-4"/>:<Mail className="size-4"/>}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">{l.subject} <span className="font-normal text-muted-foreground">→ {l.to_email}</span></div>
                    <div className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()} · {l.template} · {l.status}</div>
                  </div>
                  <Badge variant="outline" className="shrink-0">{l.template}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
