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

// Fellowship-aligned professional imagery (override via EMAIL_HERO_IMAGE / EMAIL_BG_IMAGE env)
const DEFAULT_HERO = process.env.EMAIL_HERO_IMAGE || "https://images.unsplash.com/photo-1523240795612-9da7e0c2ba7d?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_BG = process.env.EMAIL_BG_IMAGE || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=60";
// Logo from env -- change EMAIL_LOGO_URL when ABF domain/logo is ready (provided: https://ibb.co/LhSBgzZK)
const RAW_LOGO: string = (typeof process !== "undefined" && ((process.env as any).EMAIL_LOGO_URL || (process.env as any).NEXT_PUBLIC_EMAIL_LOGO_URL)) || "https://ibb.co/LhSBgzZK";
const LOGO_URL: string = RAW_LOGO.includes("ibb.co/") && !RAW_LOGO.includes("i.ibb.co/") ? RAW_LOGO.replace("ibb.co/", "i.ibb.co/") : RAW_LOGO;

export function baseEmailLayout(innerHtml: string, opts: EmailLayoutOpts = {}) {
  const preheader = opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${escapeHtml(opts.preheader)}</div>` : "";
  const hero = opts.heroImage || DEFAULT_HERO;
  const heroAlt = escapeHtml(opts.heroAlt || "ABF scholars and fellows -- empowering IT students through mentorship and scholarships");
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(opts.title || "Adeyinka Bakare Foundation")}</title></head>
<body style="margin:0;padding:0;background:${BRAND.cream};font-family:Inter,Arial,sans-serif;">
  ${preheader}
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${BRAND.cream};padding:24px 12px;background-image:url('${DEFAULT_BG}');background-size:cover;background-position:center;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(45,24,22,0.12);border:1px solid #e8ddd0;">
        <!-- Header with logo from env -->
        <tr><td style="background:${BRAND.ink};padding:16px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="vertical-align:middle;padding-right:10px">
                  <img src="${LOGO_URL}" alt="ABF logo" width="40" height="40" style="display:block;width:40px;height:40px;border-radius:10px;background:#fff;object-fit:cover;" />
                </td>
                <td style="vertical-align:middle">
                  <div style="color:#fff;font-weight:900;letter-spacing:.14em;font-size:15px;line-height:1">ABF</div>
                  <div style="color:${BRAND.gold};font-size:11px;letter-spacing:.08em;margin-top:2px">ADEYINKA BAKARE FOUNDATION</div>
                </td>
              </tr></table>
            </td>
            <td align="right" style="vertical-align:middle">
              <a href="https://adeyinkabakare.org" style="color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.2);padding:6px 10px;border-radius:999px;font-size:11px">Visit website →</a>
            </td>
          </tr></table>
        </td></tr>
        <!-- Hero -- professional fellowship vision -->
        <tr><td style="padding:0">
          <img src="${hero}" alt="${heroAlt}" width="640" style="display:block;width:100%;height:auto;max-height:240px;object-fit:cover;" />
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
