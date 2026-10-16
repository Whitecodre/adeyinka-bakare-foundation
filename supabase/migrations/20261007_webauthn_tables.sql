-- WebAuthn challenges table for storing ephemeral challenges
create table if not exists public.webauthn_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  challenge text not null,
  type text not null check (type in ('REGISTRATION', 'AUTHENTICATION')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Email OTP codes table
create table if not exists public.mfa_email_codes (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  code_hash text not null,
  purpose text not null check (purpose in ('LOGIN', 'ENABLE', 'DISABLE')),
  consumed_at timestamptz,
  attempts integer not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.webauthn_challenges enable row level security;
alter table public.mfa_email_codes enable row level security;

-- RLS policies for webauthn_challenges
create policy "Users can manage their own challenges"
  on public.webauthn_challenges
  for all
  using (auth.uid() = user_id);

-- RLS policies for mfa_email_codes
create policy "Users can manage their own email codes"
  on public.mfa_email_codes
  for all
  using (auth.uid() = admin_id);

-- Indexes for performance
create index if not exists idx_webauthn_challenges_user_id on public.webauthn_challenges(user_id);
create index if not exists idx_webauthn_challenges_expires_at on public.webauthn_challenges(expires_at);
create index if not exists idx_mfa_email_codes_admin_id on public.mfa_email_codes(admin_id);
create index if not exists idx_mfa_email_codes_expires_at on public.mfa_email_codes(expires_at);
