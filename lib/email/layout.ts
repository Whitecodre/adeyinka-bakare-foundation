type EmailLayoutOpts = {
  preheader?: string;
  heroImage?: string;
  heroAlt?: string;
  title?: string;
  subtitle?: string;
};

const BRAND = {
  ink: "#2d1816",
  maroon: "#aa322b",
  gold: "#f8c84d",
  cream: "#FFFBF8",
  sand: "#F8F2E8",
  muted: "#6b5b55",
};

const UNSPLASH_HERO = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80";
const UNSPLASH_BG = "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?auto=format&fit=crop&w=1600&q=60";

export function baseEmailLayout(innerHtml: string, opts: EmailLayoutOpts = {}) {
  const preheader = opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${escapeHtml(opts.preheader)}</div>` : "";
  const hero = opts.heroImage || UNSPLASH_HERO;
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(opts.title || "Adeyinka Bakare Foundation")}</title></head>
<body style="margin:0;padding:0;background:${BRAND.cream};font-family:Inter,Arial,sans-serif;">
  ${preheader}
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${BRAND.cream};padding:24px 12px;background-image:url('${UNSPLASH_BG}');background-size:cover;background-position:center;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(45,24,22,0.12);border:1px solid #e8ddd0;">
        <!-- Header -->
        <tr><td style="background:${BRAND.ink};padding:20px 28px;">
          <table width="100%"><tr>
            <td>
              <div style="color:#fff;font-weight:900;letter-spacing:.14em;font-size:15px;line-height:1">ABF</div>
              <div style="color:${BRAND.gold};font-size:11px;letter-spacing:.08em;margin-top:4px">ADEYINKA BAKARE FOUNDATION</div>
            </td>
            <td align="right" style="color:#fff;font-size:11px;opacity:.8">
              <a href="https://adeyinkabakare.org" style="color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.2);padding:6px 10px;border-radius:999px;font-size:11px">Visit website →</a>
            </td>
          </tr></table>
        </td></tr>
        <!-- Hero -->
        <tr><td style="padding:0">
          <img src="${hero}" alt="${escapeHtml(opts.heroAlt || "ABF community")}" width="640" style="display:block;width:100%;height:auto;max-height:220px;object-fit:cover;" />
        </td></tr>
        <!-- Title block -->
        ${opts.title ? `<tr><td style="padding:28px 28px 0 28px">
          <h1 style="margin:0;font-family:Georgia,serif;color:${BRAND.ink};font-size:22px;line-height:1.3">${escapeHtml(opts.title)}</h1>
          ${opts.subtitle ? `<p style="margin:8px 0 0;color:${BRAND.muted};font-size:13px;line-height:1.6">${escapeHtml(opts.subtitle)}</p>` : ""}
        </td></tr>` : ""}
        <!-- Content -->
        <tr><td style="padding:24px 28px 8px 28px;color:${BRAND.ink};font-size:14px;line-height:1.7">
          ${innerHtml}
        </td></tr>
        <!-- CTA divider -->
        <tr><td style="padding:8px 28px 24px 28px"><div style="height:1px;background:#f0e6d8"></div></td></tr>
        <!-- Footer -->
        <tr><td style="background:#fff9eb;padding:20px 28px;border-top:1px solid #f0e6d8">
          <table width="100%"><tr>
            <td style="color:${BRAND.muted};font-size:12px;line-height:1.6">
              <strong style="color:${BRAND.ink}">Adeyinka Bakare Foundation</strong><br/>
              Empowering Futures, Transforming Lives<br/>
              <a href="https://adeyinkabakare.org" style="color:${BRAND.maroon};text-decoration:none">adeyinkabakare.org</a> · <a href="mailto:hello@whisprwords.com" style="color:${BRAND.muted}">hello@whisprwords.com</a>
            </td>
            <td align="right" style="font-size:11px;color:#9a8a84">
              <a href="#" style="color:#9a8a84;text-decoration:underline">Unsubscribe</a><br/>© ${new Date().getFullYear()} ABF
            </td>
          </tr></table>
          <div style="margin-top:12px;text-align:center;color:#b8a99f;font-size:10px;letter-spacing:.06em">FOLLOW US · Instagram · X · LinkedIn · Facebook</div>
        </td></tr>
      </table>
      <div style="max-width:640px;margin:14px auto 0;text-align:center;color:#9a8a84;font-size:11px;line-height:1.5">
        You received this because you are connected to Adeyinka Bakare Foundation.<br/>If you didn't expect this, you can ignore this email.
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string){ return s.replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!)); }
