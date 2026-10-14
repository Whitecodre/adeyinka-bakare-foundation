import { getTransporter, getFromAddress } from "./client";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  const transporter = getTransporter();
  const { name, address } = getFromAddress();
  const from = `${name} <${address}>`;
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
