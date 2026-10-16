-- Fix upsert_admin_mfa to properly handle explicit false values
-- The previous COALESCE approach treated false as "keep existing" instead of "set to false"

BEGIN;

CREATE OR REPLACE FUNCTION public.upsert_admin_mfa(
  p_admin_id uuid,
  p_totp_enabled boolean default null,
  p_encrypted_totp_secret text default null,
  p_email_otp_enabled boolean default null,
  p_passkey_enabled boolean default null,
  p_mfa_required boolean default null
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.admin_mfa (
    admin_id,
    totp_enabled,
    encrypted_totp_secret,
    email_otp_enabled,
    passkey_enabled,
    mfa_required
  )
  VALUES (
    p_admin_id,
    COALESCE(p_totp_enabled, false),
    p_encrypted_totp_secret,
    COALESCE(p_email_otp_enabled, false),
    COALESCE(p_passkey_enabled, false),
    COALESCE(p_mfa_required, false)
  )
  ON CONFLICT (admin_id)
  DO UPDATE SET
    totp_enabled = CASE WHEN p_totp_enabled IS NOT NULL THEN p_totp_enabled ELSE admin_mfa.totp_enabled END,
    encrypted_totp_secret = CASE WHEN p_encrypted_totp_secret IS NOT NULL THEN p_encrypted_totp_secret ELSE admin_mfa.encrypted_totp_secret END,
    email_otp_enabled = CASE WHEN p_email_otp_enabled IS NOT NULL THEN p_email_otp_enabled ELSE admin_mfa.email_otp_enabled END,
    passkey_enabled = CASE WHEN p_passkey_enabled IS NOT NULL THEN p_passkey_enabled ELSE admin_mfa.passkey_enabled END,
    mfa_required = CASE WHEN p_mfa_required IS NOT NULL THEN p_mfa_required ELSE admin_mfa.mfa_required END,
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_admin_mfa TO authenticated;

COMMIT;
