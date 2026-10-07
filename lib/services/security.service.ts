import { createClient } from "../supabase/server";
import { generateTOTPSetup, verifyTOTP as verifyTOTPCode } from "../security/totp";
import { encrypt, decrypt } from "../security/encryption";
import { generateRecoveryCodes as generateRecoveryCodesUtil, hashRecoveryCode } from "../security/recovery-codes";
import type { Database, AdminMfaInsert, AdminMfaUpdate, AdminPasskeyInsert, MfaRecoveryCodesInsert } from "../types/database.types";

const ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY || "default-encryption-key-change-in-production";

export async function setupTOTP(userId: string) {
  const supabase = await createClient();

  // Generate TOTP secret and QR code
  const { secret, qrCodeUrl } = await generateTOTPSetup();

  // Encrypt the secret
  const encryptedSecret = await encrypt(secret, ENCRYPTION_KEY);

  // Check if admin_mfa record exists
  const { data: existingMfa } = await supabase
    .from("admin_mfa")
    .select("*")
    .eq("admin_id", userId)
    .single();

  if (existingMfa) {
    // Update existing record
    const { data, error } = await supabase
      .from("admin_mfa")
      .update({
        encrypted_totp_secret: encryptedSecret,
        totp_enabled: false, // Not enabled until verified
      })
      .eq("admin_id", userId)
      .select()
      .single();

    if (error) throw error;
    return { ...data, qrCodeUrl };
  } else {
    // Create new record
    const mfaData: AdminMfaInsert = {
      admin_id: userId,
      encrypted_totp_secret: encryptedSecret,
      totp_enabled: false,
      email_otp_enabled: false,
      passkey_enabled: false,
      mfa_required: true,
    };

    const { data, error } = await supabase
      .from("admin_mfa")
      .insert(mfaData)
      .select()
      .single();

    if (error) throw error;
    return { ...data, qrCodeUrl };
  }
}

export async function verifyTOTP(userId: string, code: string) {
  const supabase = await createClient();

  // Get the user's MFA settings
  const { data: mfa, error } = await supabase
    .from("admin_mfa")
    .select("*")
    .eq("admin_id", userId)
    .single();

  if (error || !mfa || !mfa.encrypted_totp_secret) {
    throw new Error("TOTP not set up for this user");
  }

  // Decrypt the secret
  const secret = await decrypt(mfa.encrypted_totp_secret, ENCRYPTION_KEY);

  // Verify the code
  const isValid = await verifyTOTPCode(code, secret);

  if (!isValid) {
    throw new Error("Invalid TOTP code");
  }

  // Enable TOTP if verification succeeds
  const { data: updatedMfa, error: updateError } = await supabase
    .from("admin_mfa")
    .update({ totp_enabled: true })
    .eq("admin_id", userId)
    .select()
    .single();

  if (updateError) throw updateError;

  return updatedMfa;
}

export async function disableTOTP(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admin_mfa")
    .update({
      totp_enabled: false,
      encrypted_totp_secret: null,
    })
    .eq("admin_id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function registerPasskey(userId: string, credential: any, deviceName?: string) {
  const supabase = await createClient();

  const passkeyData: AdminPasskeyInsert = {
    admin_id: userId,
    credential_id: credential.id,
    public_key: Buffer.from(credential.response.publicKey),
    counter: 0,
    device_name: deviceName || "Unknown Device",
  };

  const { data, error } = await supabase
    .from("admin_passkeys")
    .insert(passkeyData)
    .select()
    .single();

  if (error) throw error;

  // Update admin_mfa to enable passkey
  await supabase
    .from("admin_mfa")
    .update({ passkey_enabled: true })
    .eq("admin_id", userId);

  return data;
}

export async function authenticatePasskey(credential: any) {
  const supabase = await createClient();

  // Find the passkey by credential ID
  const { data: passkey, error } = await supabase
    .from("admin_passkeys")
    .select("*")
    .eq("credential_id", credential.id)
    .single();

  if (error || !passkey) {
    throw new Error("Passkey not found");
  }

  // Update last_used_at
  const { data: updatedPasskey, error: updateError } = await supabase
    .from("admin_passkeys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", passkey.id)
    .select()
    .single();

  if (updateError) throw updateError;

  return updatedPasskey;
}

export async function deletePasskey(passkeyId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("admin_passkeys")
    .delete()
    .eq("id", passkeyId);

  if (error) throw error;

  return { success: true };
}

export async function generateRecoveryCodes(userId: string) {
  const supabase = await createClient();

  // Check if recovery codes already exist
  const { data: existingCodes } = await supabase
    .from("mfa_recovery_codes")
    .select("*")
    .eq("admin_id", userId);

  if (existingCodes && existingCodes.length > 0) {
    throw new Error("Recovery codes already exist. Use regenerate instead.");
  }

  // Generate 10 recovery codes
  const codes = generateRecoveryCodesUtil(10);

  // Hash each code and store
  const codesToInsert: MfaRecoveryCodesInsert[] = [];
  for (const code of codes) {
    const hash = await hashRecoveryCode(code);
    codesToInsert.push({
      admin_id: userId,
      code_hash: hash,
    });
  }

  const { error } = await supabase
    .from("mfa_recovery_codes")
    .insert(codesToInsert);

  if (error) throw error;

  return codes; // Return unhashed codes for one-time display
}

export async function regenerateRecoveryCodes(userId: string) {
  const supabase = await createClient();

  // Delete existing codes
  await supabase
    .from("mfa_recovery_codes")
    .delete()
    .eq("admin_id", userId);

  // Generate new codes
  return generateRecoveryCodes(userId);
}
