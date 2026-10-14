import * as nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

export function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.zoho.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    throw new Error("SMTP_USER / SMTP_PASSWORD not set");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  } as any);

  return transporter;
}

export async function verifySmtp() {
  const t = getTransporter();
  await t.verify();
}

export function getFromAddress() {
  const name = process.env.SMTP_FROM_NAME || "Adeyinka Bakare Foundation";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  return { name, address: from };
}
