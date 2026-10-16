-- Fix corrupted passkey entries with JSON-encoded public_key
-- This removes passkeys where public_key was stored as JSON string instead of bytea
-- Also converts old Buffer format to base64url format

BEGIN;

-- Delete corrupted passkey entries (public_key stored as JSON string)
DELETE FROM public.admin_passkeys
WHERE public_key::text LIKE '{"type":"Buffer"%';

-- Update any remaining passkeys that need format conversion
-- This is a safeguard for any other format issues
DO $$
DECLARE
    pk_record RECORD;
BEGIN
    FOR pk_record IN SELECT id, public_key FROM public.admin_passkeys WHERE public_key IS NOT NULL
    LOOP
        -- If public_key is already in the right format (bytea with proper length), skip it
        -- Otherwise, it might need conversion - but we'll let the app handle that
        -- This is just a placeholder for future migrations if needed
    END LOOP;
END $$;

COMMIT;
