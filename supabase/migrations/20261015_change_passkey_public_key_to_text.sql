-- Change public_key from bytea to text to match WORKNOW implementation
-- This allows storing base64url COSE public key strings directly

BEGIN;

-- Drop the index if it exists
DROP INDEX IF EXISTS idx_admin_passkeys_admin;

-- Alter the column type from bytea to text
ALTER TABLE public.admin_passkeys ALTER COLUMN public_key TYPE text USING public_key::text;

-- Recreate the index
CREATE INDEX IF NOT EXISTS idx_admin_passkeys_admin ON public.admin_passkeys(admin_id);

COMMIT;
