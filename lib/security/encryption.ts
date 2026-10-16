export async function encrypt(text: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decrypt(encrypted: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  return decoder.decode(decrypted);
}

// TOTP-specific encryption using TOTP_ENCRYPTION_KEY from environment
// AES-GCM requires key to be exactly 16, 24, or 32 bytes (128, 192, or 256 bits)
const TOTP_ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY ?? 'abf-totp-enc-key-32byt';

// Ensure the key is exactly 32 bytes for AES-256-GCM
function getEncryptionKey(): string {
  let key = TOTP_ENCRYPTION_KEY;
  // Pad or truncate to exactly 32 bytes
  if (key.length < 32) {
    key = key.padEnd(32, '0');
  } else if (key.length > 32) {
    key = key.slice(0, 32);
  }
  return key;
}

export async function encryptTOTPSecret(secret: string): Promise<string> {
  return encrypt(secret, getEncryptionKey());
}

export async function decryptTOTPSecret(encrypted: string): Promise<string> {
  return decrypt(encrypted, getEncryptionKey());
}
