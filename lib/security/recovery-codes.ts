export function generateRecoveryCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 36).toString(36).toUpperCase()
    ).join("");
    codes.push(code);
  }
  return codes;
}

export async function hashRecoveryCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function verifyRecoveryCode(code: string, hash: string): Promise<boolean> {
  const codeHash = await hashRecoveryCode(code);
  return codeHash === hash;
}
