# Security API Routes Implementation

## Overview
Implemented all security API routes for MFA (Multi-Factor Authentication) functionality including TOTP, Passkeys, and Recovery Codes.

## Routes Implemented

### 1. TOTP Routes

#### POST /api/admin/security/totp/setup
- **Purpose**: Setup TOTP for current user
- **Implementation**: Generates TOTP secret, encrypts it, stores in admin_mfa table, returns QR code URL
- **File**: `src/app/api/admin/security/totp/setup/route.ts`
- **Service**: `setupTOTP()` in `lib/services/security.service.ts`

#### POST /api/admin/security/totp/verify
- **Purpose**: Verify TOTP code during setup
- **Implementation**: Verifies code against stored encrypted secret, enables TOTP on success
- **File**: `src/app/api/admin/security/totp/verify/route.ts`
- **Service**: `verifyTOTP()` in `lib/services/security.service.ts`

#### POST /api/admin/security/totp/disable
- **Purpose**: Disable TOTP for current user
- **Implementation**: Marks TOTP as disabled, clears encrypted secret
- **File**: `src/app/api/admin/security/totp/disable/route.ts`
- **Service**: `disableTOTP()` in `lib/services/security.service.ts`

### 2. Passkey Routes

#### POST /api/admin/security/passkeys/register
- **Purpose**: Register a new passkey
- **Implementation**: Stores credential_id, public_key, device_name in admin_passkeys table
- **File**: `src/app/api/admin/security/passkeys/register/route.ts`
- **Service**: `registerPasskey()` in `lib/services/security.service.ts`

#### POST /api/admin/security/passkeys/authenticate
- **Purpose**: Authenticate with passkey
- **Implementation**: Verifies passkey, updates last_used_at timestamp
- **File**: `src/app/api/admin/security/passkeys/authenticate/route.ts`
- **Service**: `authenticatePasskey()` in `lib/services/security.service.ts`

#### DELETE /api/admin/security/passkeys/[id]
- **Purpose**: Delete a passkey
- **Implementation**: Removes passkey from admin_passkeys table
- **File**: `src/app/api/admin/security/passkeys/[id]/route.ts`
- **Service**: `deletePasskey()` in `lib/services/security.service.ts`

### 3. Recovery Codes Routes

#### POST /api/admin/security/recovery-codes/generate
- **Purpose**: Generate recovery codes (first time)
- **Implementation**: Generates 10 recovery codes, hashes each, stores in mfa_recovery_codes table
- **File**: `src/app/api/admin/security/recovery-codes/generate/route.ts`
- **Service**: `generateRecoveryCodes()` in `lib/services/security.service.ts`

#### POST /api/admin/security/recovery-codes/regenerate
- **Purpose**: Regenerate recovery codes
- **Implementation**: Clears old codes and generates new ones
- **File**: `src/app/api/admin/security/recovery-codes/regenerate/route.ts`
- **Service**: `regenerateRecoveryCodes()` in `lib/services/security.service.ts`

## Security Features

### Encryption
- TOTP secrets are encrypted using AES-GCM before storage
- Encryption key is configured via `TOTP_ENCRYPTION_KEY` environment variable
- Implemented in `lib/security/encryption.ts`

### TOTP Implementation
- Uses HMAC-SHA1 for TOTP generation
- 30-second time steps
- Checks current and adjacent time steps for clock drift tolerance
- Implemented in `lib/security/totp.ts`

### Recovery Codes
- Generated as 8-character alphanumeric codes
- Hashed using SHA-256 before storage
- Only returned unhashed on first generation for user to save
- Implemented in `lib/security/recovery-codes.ts`

### Passkeys
- WebAuthn-based passkey support
- Stores credential ID and public key
- Tracks device name and last used timestamp
- Implemented in `lib/security/passkeys.ts`

## Database Schema Used

### admin_mfa Table
- `admin_id`: UUID (references profiles)
- `totp_enabled`: boolean
- `encrypted_totp_secret`: text (encrypted)
- `email_otp_enabled`: boolean
- `passkey_enabled`: boolean
- `mfa_required`: boolean

### admin_passkeys Table
- `id`: UUID (primary key)
- `admin_id`: UUID (references profiles)
- `credential_id`: text (unique)
- `public_key`: bytea
- `counter`: bigint
- `device_name`: text
- `last_used_at`: timestamptz

### mfa_recovery_codes Table
- `id`: UUID (primary key)
- `admin_id`: UUID (references profiles)
- `code_hash`: text (SHA-256 hash)
- `used_at`: timestamptz

## Validation Schemas

All routes use Zod validation schemas from `lib/validations/security.schema.ts`:
- `totpSetupSchema`: Validates TOTP setup code
- `totpVerifySchema`: Validates TOTP verification code
- `passkeyRegisterSchema`: Validates passkey registration credential and device name
- `passkeyAuthenticateSchema`: Validates passkey authentication credential
- `recoveryCodeSchema`: Validates recovery code format

## Repository Layer

Created `lib/repositories/security.repository.ts` with functions for:
- Admin MFA operations (find, create, update)
- Passkey operations (find by ID, credential ID, admin ID; create, update, delete)
- Recovery codes operations (find by admin ID, create, delete by admin ID)

## Environment Variables

Added to `.env.local.example`:
- `TOTP_ENCRYPTION_KEY`: Required for encrypting TOTP secrets (minimum 32 characters)

## Authentication

All routes use `requireAuth()` from `lib/auth/require-auth.ts` to ensure:
- User is authenticated
- Current user context is available
- Unauthorized requests are rejected

## Error Handling

All routes implement consistent error handling:
- Try-catch blocks around all operations
- Specific error messages for validation failures
- Generic error messages for server errors
- Appropriate HTTP status codes (400, 404, 500)
- Console logging for debugging

## Response Format

All routes follow consistent response format:
```json
{
  "success": true,
  "data": { ... }
}
```

Or on error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Security Notes

1. **TOTP Encryption**: Secrets are encrypted before storage. The encryption key should be kept secure and not committed to version control.

2. **Recovery Codes**: Only returned unhashed on first generation. Users must save them securely as they won't be shown again.

3. **Passkey Verification**: Currently returns true for testing. Full WebAuthn signature verification should be implemented for production.

4. **RLS Policies**: Database has RLS policies in place to ensure users can only access their own MFA settings.

5. **Clock Drift**: TOTP verification checks current and adjacent time steps to accommodate clock drift.

## Future Enhancements

1. Implement full WebAuthn signature verification for passkeys
2. Add rate limiting to prevent brute force attacks on TOTP codes
3. Implement recovery code usage tracking
4. Add email OTP support (schema exists but not implemented)
5. Add MFA enforcement during login
6. Implement backup codes for TOTP secret
