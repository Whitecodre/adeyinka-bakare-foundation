import { generateSecret, verify, generateURI } from 'otplib';
import QRCode from 'qrcode';

const TOTP_ISSUER = process.env.TOTP_ISSUER ?? 'ABF Admin';
const TOTP_WINDOW = 1; // Allow 1 time step before/after (±30 seconds tolerance)
const TOTP_STEP = 30; // 30-second time step

export async function generateTOTPSetup(email: string): Promise<{
  secret: string;
  qrCodeUrl: string;
  otpauthUrl: string;
}> {
  // Generate a new secret using otplib
  const secret = generateSecret();

  // Generate otpauth:// URI
  const otpauthUrl = generateURI({
    issuer: TOTP_ISSUER,
    label: email,
    secret,
  });

  // Generate QR code as data URL
  const qrCodeUrl = await QRCode.toDataURL(otpauthUrl, { width: 280, margin: 1 });

  return {
    secret,
    qrCodeUrl,
    otpauthUrl,
  };
}

export async function verifyTOTP(token: string, secret: string): Promise<boolean> {
  // Use otplib's verify function
  const result = await verify({
    token,
    secret,
  });

  // otplib returns { valid: boolean, delta: number } - we only need the valid field
  return result.valid;
}
