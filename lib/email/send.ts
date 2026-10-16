import { getTransporter, getFromAddress } from "./client";
import { getSettings } from "../services/settings.service";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  logoUrl?: string;
}) {
  const transporter = getTransporter();
  const { name, address } = getFromAddress();
  const from = `${name} <${address}>`;

  // If logoUrl not provided, fetch from site settings
  let finalLogoUrl = opts.logoUrl;
  if (!finalLogoUrl) {
    try {
      const settings = await getSettings();
      finalLogoUrl = settings.logo || undefined;
    } catch (error) {
      console.error("Failed to fetch site settings for logo:", error);
    }
  }

  const info = await transporter.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: opts.replyTo || process.env.SMTP_REPLY_TO || undefined,
  });
  return info;
}
