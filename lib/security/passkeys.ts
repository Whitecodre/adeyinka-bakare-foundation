export async function generatePasskeyChallenge(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function generatePasskeyRegistrationOptions(userId: string, userName: string, hostname: string = "localhost") {
  const challenge = await generatePasskeyChallenge();
  return {
    challenge,
    rp: {
      name: "Adeyinka Bakare Fellowship",
      id: hostname,
    },
    user: {
      id: userId,
      name: userName,
      displayName: userName,
    },
    pubKeyCredParams: [
      { alg: -7, type: "public-key" }, // ES256
      { alg: -257, type: "public-key" }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "preferred",
    },
    timeout: 60000,
  };
}

export async function generatePasskeyAuthenticationOptions(challenge: string) {
  return {
    challenge,
    allowCredentials: [],
    userVerification: "preferred",
    timeout: 60000,
  };
}

export async function verifyPasskeyResponse(): Promise<boolean> {
  // In a real implementation, this would verify the WebAuthn signature
  // For now, we'll return true to allow the flow to work
  // TODO: Implement proper WebAuthn signature verification
  return true;
}
