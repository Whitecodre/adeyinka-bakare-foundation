import { baseEmailLayout } from "./layout";

function esc(s: string){ return s.replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!)); }

export function adminInviteEmail(opts: { fullName: string; email: string; role: string; inviteUrl: string; expiresAt: string; inviterName: string }) {
  const roleLabel = opts.role.replace("_"," ").replace(/\b\w/g, c=>c.toUpperCase());
  const subject = `You're invited to join Adeyinka Bakare Foundation as ${roleLabel}`;
  const html = baseEmailLayout(`
    <p style="margin:0 0 16px">Hi ${esc(opts.fullName)},</p>
    <p style="margin:0 0 16px"><strong>${esc(opts.inviterName)}</strong> invited you to join <strong>Adeyinka Bakare Foundation</strong> as <strong>${esc(roleLabel)}</strong>.</p>
    <p style="margin:0 0 20px"><a href="${opts.inviteUrl}" style="display:inline-block;background:#aa322b;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:800;font-size:13px;letter-spacing:.02em">Accept invite & set password →</a></p>
    <p style="margin:0 0 8px;color:#6b5b55;font-size:13px">Or copy this link:</p>
    <p style="word-break:break-all;margin:0 0 16px"><a href="${opts.inviteUrl}" style="color:#aa322b">${opts.inviteUrl}</a></p>
    <div style="background:#fff9eb;border:1px solid #f0e6d8;border-radius:12px;padding:12px 14px;font-size:12px;color:#6b5b55">
      <strong style="color:#2d1816">Invite details</strong><br/>
      Email: ${esc(opts.email)}<br/>
      Role: ${esc(roleLabel)}<br/>
      Expires: ${esc(new Date(opts.expiresAt).toLocaleString())}
    </div>
    <p style="margin:16px 0 0;color:#8a7a74;font-size:11px">If you didn't expect this invite, you can safely ignore it — the link will expire.</p>
  `, { title: `You're invited as ${roleLabel}`, subtitle: "Set your password within 7 days to activate your account.", preheader: `You've been invited as ${roleLabel} — accept within 7 days` });
  const text = `You're invited, ${opts.fullName}\n\n${opts.inviterName} invited you as ${roleLabel}.\n\nAccept: ${opts.inviteUrl}\nExpires: ${opts.expiresAt}\n`;
  return { subject, html, text };
}

export function welcomeEmail(opts: { fullName: string; loginUrl: string }) {
  const subject = `Welcome to Adeyinka Bakare Foundation`;
  const html = baseEmailLayout(`
    <p style="margin:0 0 16px">Hi ${esc(opts.fullName)},</p>
    <p style="margin:0 0 16px">Your account is active — you can now sign in to the ABF admin console.</p>
    <p style="margin:0 0 20px"><a href="${opts.loginUrl}" style="display:inline-block;background:#2d1816;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:800">Sign in →</a></p>
  `, { title: `Welcome, ${esc(opts.fullName)}`, subtitle: "Your ABF account is ready." });
  const text = `Welcome, ${opts.fullName}\nSign in at ${opts.loginUrl}`;
  return { subject, html, text };
}

export function memberWelcomeEmail(opts: { fullName: string; }) {
  const subject = `Welcome to Adeyinka Bakare Foundation — you're in!`;
  const html = baseEmailLayout(`
    <p style="margin:0 0 16px">Hi ${esc(opts.fullName)},</p>
    <p style="margin:0 0 16px">Thanks for joining Adeyinka Bakare Foundation. We're excited to have you in our fellowship — expect updates on programmes, events, and opportunities to get involved.</p>
    <div style="background:#fbf4f1;border-radius:12px;padding:14px;font-size:13px"><strong>What's next?</strong><br/>Explore programmes, meet beneficiaries, and stay tuned for volunteer openings.</div>
  `, { title: "Welcome to ABF!", subtitle: "Your membership is confirmed.", heroImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80" });
  const text = `Hi ${opts.fullName}, welcome to ABF!`;
  return { subject, html, text };
}

export function volunteerReceivedEmail(opts: { fullName: string; interest?: string }) {
  const subject = `We received your volunteer application — thank you!`;
  const html = baseEmailLayout(`
    <p style="margin:0 0 16px">Hi ${esc(opts.fullName)},</p>
    <p style="margin:0 0 16px">Thank you for applying to volunteer${opts.interest ? ` for <strong>${esc(opts.interest)}</strong>` : ""} with ABF. Our team will review your application and reach out shortly.</p>
    <p style="margin:0 0 16px;color:#6b5b55;font-size:12px">You'll get an email when your status changes.</p>
  `, { title: "Application received", subtitle: "We'll be in touch soon.", heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" });
  const text = `Hi ${opts.fullName}, we received your volunteer application.`;
  return { subject, html, text };
}

export function volunteerStatusEmail(opts: { fullName: string; status: string; }) {
  const subject = `Your ABF volunteer status: ${opts.status}`;
  const html = baseEmailLayout(`
    <p style="margin:0 0 16px">Hi ${esc(opts.fullName)},</p>
    <p style="margin:0 0 16px">Your volunteer application status is now <strong>${esc(opts.status)}</strong>.</p>
  `, { title: `Status: ${esc(opts.status)}`, subtitle: "Thank you for staying connected." });
  const text = `Hi ${opts.fullName}, status: ${opts.status}`;
  return { subject, html, text };
}

export function adminNotifyEmail(opts: { title: string; message: string; ctaUrl?: string; ctaLabel?: string }) {
  const subject = opts.title;
  const html = baseEmailLayout(`
    <p style="margin:0 0 12px">${esc(opts.message)}</p>
    ${opts.ctaUrl ? `<p style="margin:16px 0"><a href="${opts.ctaUrl}" style="display:inline-block;background:#aa322b;color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:700">${esc(opts.ctaLabel || "View in admin")}</a></p>` : ""}
  `, { title: opts.title, subtitle: "New activity on ABF" });
  const text = `${opts.title}\n\n${opts.message}${opts.ctaUrl?`\n${opts.ctaUrl}`:""}`;
  return { subject, html, text };
}

export function newsletterEmail(opts: { title: string; excerpt?: string; url?: string }) {
  const subject = opts.title;
  const html = baseEmailLayout(`
    <p style="margin:0 0 12px">${esc(opts.excerpt || "")}</p>
    ${opts.url ? `<p><a href="${opts.url}" style="display:inline-block;background:#2d1816;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">Read more →</a></p>` : ""}
  `, { title: opts.title, heroImage: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?auto=format&fit=crop&w=1200&q=80" });
  const text = `${opts.title}\n\n${opts.excerpt||""}\n${opts.url||""}`;
  return { subject, html, text };
}
