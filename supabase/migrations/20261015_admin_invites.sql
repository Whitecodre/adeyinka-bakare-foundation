-- Admin invites for invite-only onboarding (Zoho email)
create table if not exists public.admin_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  role text not null check (role in ('super_admin','admin','editor')),
  token_hash text not null unique,
  expires_at timestamptz not null,
  invited_by uuid references public.profiles(id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists admin_invites_email_idx on public.admin_invites (lower(email));
create index if not exists admin_invites_token_hash_idx on public.admin_invites (token_hash);
create index if not exists admin_invites_expires_at_idx on public.admin_invites (expires_at);

alter table public.admin_invites enable row level security;

create policy "Super admins can manage invites"
  on public.admin_invites for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin'));

-- Allow service_role to bypass (for API using service key) — no extra policy needed (service_role bypasses RLS)
