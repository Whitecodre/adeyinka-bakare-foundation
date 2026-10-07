export async function generateTOTPSetup(): Promise<{
  secret: string;
  qrCodeUrl: string;
}> {
  const secret = await import("./secrets").then(m => m.generateTOTPSecret());
  const issuer = encodeURIComponent("Adeyinka Bakare Fellowship");
  const account = encodeURIComponent("Admin");
  const otpauth = `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}`;
  
  return {
    secret,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`,
  };
}

export async function verifyTOTP(token: string, secret: string): Promise<boolean> {
  // Basic TOTP verification using HMAC-SHA1
  const timeStep = 30; // 30-second time step
  const time = Math.floor(Date.now() / 1000);
  const counter = Math.floor(time / timeStep);

  // Check current time step and adjacent time steps (for clock drift)
  for (let offset = -1; offset <= 1; offset++) {
    const counterWithOffset = counter + offset;
    const expectedToken = await generateTOTPForCounter(secret, counterWithOffset);
    if (token === expectedToken) {
      return true;
    }
  }

  return false;
}

async function generateTOTPForCounter(secret: string, counter: number): Promise<string> {
  const encoder = new TextEncoder();
  const secretBytes = encoder.encode(secret);

  // Convert counter to 8-byte big-endian array
  const counterBytes = new Uint8Array(8);
  for (let i = 7; i >= 0; i--) {
    counterBytes[i] = counter & 0xff;
    counter >>= 8;
  }

  // Import key for HMAC
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  // Sign the counter
  const signature = await crypto.subtle.sign("HMAC", key, counterBytes);
  const hmac = new Uint8Array(signature);

  // Dynamic truncation
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  // Get 6 digits
  return (code % 1000000).toString().padStart(6, "0");
}
