-- Add upsert function for admin_mfa table
-- This ensures a row exists for each admin when enabling MFA

BEGIN;

CREATE OR REPLACE FUNCTION public.upsert_admin_mfa(
  p_admin_id uuid,
  p_totp_enabled boolean default false,
  p_encrypted_totp_secret text default null,
  p_email_otp_enabled boolean default false,
  p_passkey_enabled boolean default false,
  p_mfa_required boolean default true
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
    p_totp_enabled,
    p_encrypted_totp_secret,
    p_email_otp_enabled,
    p_passkey_enabled,
    p_mfa_required
  )
  ON CONFLICT (admin_id)
  DO UPDATE SET
    totp_enabled = COALESCE(p_totp_enabled, admin_mfa.totp_enabled),
    encrypted_totp_secret = COALESCE(p_encrypted_totp_secret, admin_mfa.encrypted_totp_secret),
    email_otp_enabled = COALESCE(p_email_otp_enabled, admin_mfa.email_otp_enabled),
    passkey_enabled = COALESCE(p_passkey_enabled, admin_mfa.passkey_enabled),
    mfa_required = COALESCE(p_mfa_required, admin_mfa.mfa_required),
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_admin_mfa TO authenticated;

COMMIT;
