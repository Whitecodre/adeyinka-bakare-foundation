-- Email system: logs + studio support (reusable header/footer via app layout, not DB)
-- Run after 20261015_admin_invites.sql

-- Email logs: every outbound email is recorded for studio + audit
create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  to_email text not null,
  to_name text,
  subject text not null,
  template text not null, -- e.g. admin_invite, welcome, custom
  html_preview text, -- truncated html for preview (first 8000 chars)
  status text not null default 'sent' check (status in ('queued','sent','failed')),
  provider text not null default 'zoho',
  provider_id text, -- nodemailer messageId
  metadata jsonb not null default '{}'::jsonb, -- {invite_id, volunteer_id, member_id, etc.}
  created_by uuid references public.profiles(id) on delete set null,
  error text,
  created_at timestamptz not null default now()
);
create index if not exists email_logs_to_email_idx on public.email_logs (lower(to_email));
create index if not exists email_logs_template_idx on public.email_logs (template);
create index if not exists email_logs_created_at_idx on public.email_logs (created_at desc);
create index if not exists email_logs_created_by_idx on public.email_logs (created_by);

alter table public.email_logs enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Admins can manage email logs') then
    create policy "Admins can manage email logs" on public.email_logs for all
      using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('super_admin','admin')))
      with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('super_admin','admin')));
  end if;
end $$;

-- Ensure admin_invites exists with dynamic per-invite token (no env secret)
-- (created in 20261015_admin_invites.sql; this is idempotent guard)
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

-- Newsletter subscribers (if not exists) for broadcast
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  status text not null default 'subscribed' check (status in ('subscribed','unsubscribed','pending')),
  source text, -- e.g. footer, member_signup, volunteer_signup
  created_at timestamptz not null default now()
);
create index if not exists newsletter_subscribers_email_idx on public.newsletter_subscribers (lower(email));
alter table public.newsletter_subscribers enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Public can subscribe') then
    create policy "Public can subscribe" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Admins can manage subscribers') then
    create policy "Admins can manage subscribers" on public.newsletter_subscribers for all to authenticated
      using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('super_admin','admin')))
      with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('super_admin','admin')));
  end if;
end $$;

-- Notifications helper: ensure every email also inserts into notifications for realtime bell
-- No schema change needed; app code will do: insert into notifications + email_logs in same service
