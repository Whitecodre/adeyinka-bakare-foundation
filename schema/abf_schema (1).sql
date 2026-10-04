-- ABF Website Database Schema
-- Supabase PostgreSQL
-- Ready-to-run initial migration
--
-- Notes:
-- 1. Supabase Auth owns auth.users. profiles.id references auth.users(id).
-- 2. TOTP secrets will be encrypted by the server-side security service
--    before being stored in admin_mfa.encrypted_totp_secret.
-- 4. Recovery codes are stored only as hashes.
-- 5. Actual uploaded files live in Supabase Storage or whatever other storage we decide to use. media stores metadata.

begin;

create extension if not exists pgcrypto;

-- ============================================================
-- OUR MAIN TYPES ENUMS
-- ============================================================

do $$ begin
  create type public.user_role as enum ('super_admin', 'admin', 'editor');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.record_status as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.member_status as enum ('active', 'inactive', 'graduated', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.volunteer_status as enum ('new', 'contacted', 'accepted', 'rejected', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.media_type as enum ('image', 'audio', 'video', 'document', 'other');
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- A COMMON REUSABLE UPDATED_AT FUNCTION
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- PROFILES AND ADMINS
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'editor',
  status text not null default 'active'
    check (status in ('active', 'inactive', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role
  on public.profiles(role);

create index if not exists idx_profiles_status
  on public.profiles(status);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- An helper to be used by RLS policies.
-- NB: SECURITY DEFINER avoids recursive profile RLS checks.
create or replace function public.has_admin_role(required_roles public.user_role[] default array['super_admin','admin','editor']::public.user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role = any(required_roles)
  );
$$;

revoke all on function public.has_admin_role(public.user_role[]) from public;
grant execute on function public.has_admin_role(public.user_role[]) to authenticated;

-- ============================================================
-- MEMBERS
-- ============================================================

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  department text,
  level text,
  session text,
  photo text,
  status public.member_status not null default 'active',
  joined_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_members_status
  on public.members(status);

create index if not exists idx_members_department
  on public.members(department);

create index if not exists idx_members_session
  on public.members(session);

create index if not exists idx_members_name
  on public.members(full_name);

create trigger members_set_updated_at
before update on public.members
for each row execute function public.set_updated_at();

-- ============================================================
-- VOLUNTEERS
-- ============================================================

create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  department text,
  level text,
  interest text,
  message text,
  status public.volunteer_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_volunteers_status
  on public.volunteers(status);

create index if not exists idx_volunteers_created_at
  on public.volunteers(created_at desc);

create index if not exists idx_volunteers_email
  on public.volunteers(lower(email));

create trigger volunteers_set_updated_at
before update on public.volunteers
for each row execute function public.set_updated_at();

-- ============================================================
-- PROGRAMMES
-- ============================================================

create table if not exists public.programmes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  image text,
  status public.record_status not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_programmes_status
  on public.programmes(status);

create index if not exists idx_programmes_featured
  on public.programmes(featured)
  where featured = true;

create trigger programmes_set_updated_at
before update on public.programmes
for each row execute function public.set_updated_at();

-- ============================================================
-- BENEFICIARIES
-- ============================================================

create table if not exists public.beneficiaries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  department text,
  level text,
  session text,
  programme text,
  photo text,
  bio text,
  status public.record_status not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_beneficiaries_status
  on public.beneficiaries(status);

create index if not exists idx_beneficiaries_featured
  on public.beneficiaries(featured)
  where featured = true;

create index if not exists idx_beneficiaries_department
  on public.beneficiaries(department);

create index if not exists idx_beneficiaries_session
  on public.beneficiaries(session);

create trigger beneficiaries_set_updated_at
before update on public.beneficiaries
for each row execute function public.set_updated_at();

-- ============================================================
-- TESTIMONIALS
-- ============================================================

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid references public.beneficiaries(id) on delete set null,
  content text not null,
  media_url text,
  media_type public.media_type,
  featured boolean not null default false,
  status public.record_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    media_url is null
    or media_type is not null
  )
);

create index if not exists idx_testimonials_beneficiary
  on public.testimonials(beneficiary_id);

create index if not exists idx_testimonials_status
  on public.testimonials(status);

create index if not exists idx_testimonials_featured
  on public.testimonials(featured)
  where featured = true;

create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

-- ============================================================
-- EVENTS
-- ============================================================

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  location text,
  start_at timestamptz not null,
  end_at timestamptz,
  image text,
  status public.record_status not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at is null or end_at >= start_at)
);

create index if not exists idx_events_start_at
  on public.events(start_at desc);

create index if not exists idx_events_status
  on public.events(status);

create index if not exists idx_events_featured
  on public.events(featured)
  where featured = true;

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

-- ============================================================
-- NEWS
-- ============================================================

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  image text,
  author_id uuid references public.profiles(id) on delete set null,
  status public.record_status not null default 'draft',
  published_at timestamptz,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_news_status_published
  on public.news(status, published_at desc);

create index if not exists idx_news_author
  on public.news(author_id);

create index if not exists idx_news_featured
  on public.news(featured)
  where featured = true;

create trigger news_set_updated_at
before update on public.news
for each row execute function public.set_updated_at();

-- ============================================================
-- MEDIA METADATA
-- ============================================================

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  storage_path text not null unique,
  type public.media_type not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_media_type
  on public.media(type);

create index if not exists idx_media_uploaded_by
  on public.media(uploaded_by);

create index if not exists idx_media_created_at
  on public.media(created_at desc);

-- ============================================================
-- WE'LL NEED EDITABLE CONTENT SECTIONS
-- ============================================================

create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text,
  content text,
  image text,
  status public.record_status not null default 'published',
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contents_status
  on public.contents(status);

create trigger contents_set_updated_at
before update on public.contents
for each row execute function public.set_updated_at();

-- ============================================================
-- FOOTER
-- ============================================================

create table if not exists public.footer_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create index if not exists idx_footer_sections_order
  on public.footer_sections(sort_order);

create table if not exists public.footer_links (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.footer_sections(id) on delete cascade,
  label text not null,
  url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create index if not exists idx_footer_links_section_order
  on public.footer_links(section_id, sort_order);

-- ============================================================
-- SITE SETTINGS
-- ============================================================

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null,
  tagline text,
  logo text,
  favicon text,
  email text,
  phone text,
  address text,
  whatsapp text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = '00000000-0000-0000-0000-000000000001')
);

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- ============================================================
-- SOCIAL LINKS
-- ============================================================

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create index if not exists idx_social_links_order
  on public.social_links(sort_order);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_recipient_unread
  on public.notifications(recipient_id, created_at desc)
  where read_at is null;

create index if not exists idx_notifications_recipient_created
  on public.notifications(recipient_id, created_at desc);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_actor
  on public.audit_logs(actor_id, created_at desc);

create index if not exists idx_audit_logs_entity
  on public.audit_logs(entity, entity_id, created_at desc);

create index if not exists idx_audit_logs_created_at
  on public.audit_logs(created_at desc);

-- ============================================================
-- ADMIN MFA
-- ============================================================

create table if not exists public.admin_mfa (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null unique references public.profiles(id) on delete cascade,
  totp_enabled boolean not null default false,
  encrypted_totp_secret text,
  email_otp_enabled boolean not null default false,
  passkey_enabled boolean not null default false,
  mfa_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_admin_mfa_admin
  on public.admin_mfa(admin_id);

create trigger admin_mfa_set_updated_at
before update on public.admin_mfa
for each row execute function public.set_updated_at();

-- ============================================================
-- ADMIN PASSKEYS
-- ============================================================

create table if not exists public.admin_passkeys (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  credential_id text not null unique,
  public_key bytea not null,
  counter bigint not null default 0,
  device_name text,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_passkeys_admin
  on public.admin_passkeys(admin_id);

-- ============================================================
-- MFA RECOVERY CODES
-- ============================================================

create table if not exists public.mfa_recovery_codes (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  code_hash text not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_mfa_recovery_codes_admin
  on public.mfa_recovery_codes(admin_id);

-- ============================================================
-- NOW, AUDIT FUNCTION
-- ============================================================

create or replace function public.write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid;
  old_record jsonb;
  new_record jsonb;
begin
  actor := auth.uid();

  if tg_op = 'INSERT' then
    new_record := to_jsonb(new);
  elsif tg_op = 'UPDATE' then
    old_record := to_jsonb(old);
    new_record := to_jsonb(new);
  elsif tg_op = 'DELETE' then
    old_record := to_jsonb(old);
  end if;

  insert into public.audit_logs (
    actor_id,
    action,
    entity,
    entity_id,
    old_data,
    new_data
  )
  values (
    actor,
    lower(tg_op),
    tg_table_name,
    case
      when tg_op = 'DELETE' then (old_record ->> 'id')::uuid
      else (new_record ->> 'id')::uuid
    end,
    old_record,
    new_record
  );

  return coalesce(new, old);
end;
$$;

-- Audit meaningful admin-managed records.
create trigger programmes_audit
after insert or update or delete on public.programmes
for each row execute function public.write_audit_log();

create trigger beneficiaries_audit
after insert or update or delete on public.beneficiaries
for each row execute function public.write_audit_log();

create trigger testimonials_audit
after insert or update or delete on public.testimonials
for each row execute function public.write_audit_log();

create trigger events_audit
after insert or update or delete on public.events
for each row execute function public.write_audit_log();

create trigger news_audit
after insert or update or delete on public.news
for each row execute function public.write_audit_log();

create trigger contents_audit
after insert or update or delete on public.contents
for each row execute function public.write_audit_log();

create trigger site_settings_audit
after insert or update or delete on public.site_settings
for each row execute function public.write_audit_log();

-- ============================================================
-- ADMIN NOTIFICATION FUNCTIONS
-- ============================================================

create or replace function public.notify_admins(
  notification_type text,
  notification_title text,
  notification_message text,
  notification_data jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (
    recipient_id,
    type,
    title,
    message,
    data
  )
  select
    p.id,
    notification_type,
    notification_title,
    notification_message,
    notification_data
  from public.profiles p
  where p.status = 'active'
    and p.role in ('super_admin', 'admin');
end;
$$;

create or replace function public.notify_new_volunteer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_admins(
    'new_volunteer',
    'New volunteer application',
    new.full_name || ' submitted a volunteer application.',
    jsonb_build_object('volunteer_id', new.id)
  );

  return new;
end;
$$;

create trigger volunteers_notify_admins
after insert on public.volunteers
for each row execute function public.notify_new_volunteer();

create or replace function public.notify_new_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_admins(
    'new_member',
    'New member added',
    new.full_name || ' was added as a member.',
    jsonb_build_object('member_id', new.id)
  );

  return new;
end;
$$;

create trigger members_notify_admins
after insert on public.members
for each row execute function public.notify_new_member();


-- ============================================================
-- SUPABASE/POSTGREST GRANTS
-- ============================================================
--
-- RLS controls WHICH rows each role can access.
-- GRANT controls WHETHER the role can access the table at all.
-- Both are required for Supabase/PostgREST due to their new policies and updates.
--
-- These grants intentionally do not replace RLS.
-- `anon` gets the base privileges needed for public website reads
-- and the public volunteer INSERT endpoint.
-- `authenticated` gets the base privileges needed for admin RLS.
-- `service_role` receives full database access as the server-side
-- Supabase service role and bypasses RLS by design.
--

grant usage on schema public to anon, authenticated, service_role;

grant select on all tables in schema public to anon;
grant insert on public.volunteers to anon;

grant select, insert, update, delete on all tables in schema public
  to authenticated;

grant all privileges on all tables in schema public
  to service_role;

-- Here's to keep privileges correct for tables created by future migrations.
alter default privileges in schema public
  grant select on tables to anon;

alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;

alter default privileges in schema public
  grant all on tables to service_role;

-- Functions called by Supabase/PostgREST or security policies.
grant execute on function public.has_admin_role(public.user_role[]) to authenticated;
grant execute on function public.notify_admins(text, text, text, jsonb) to authenticated, service_role;

-- Service-role execution for internal/server-side functions.
grant execute on function public.set_updated_at() to service_role;
grant execute on function public.write_audit_log() to service_role;
grant execute on function public.notify_new_volunteer() to service_role;
grant execute on function public.notify_new_member() to service_role;

-- ============================================================
-- RLS (IMPORTANT FOR SECURITY - DON'T REMOVE)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.volunteers enable row level security;
alter table public.programmes enable row level security;
alter table public.beneficiaries enable row level security;
alter table public.testimonials enable row level security;
alter table public.events enable row level security;
alter table public.news enable row level security;
alter table public.media enable row level security;
alter table public.contents enable row level security;
alter table public.footer_sections enable row level security;
alter table public.footer_links enable row level security;
alter table public.site_settings enable row level security;
alter table public.social_links enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.admin_mfa enable row level security;
alter table public.admin_passkeys enable row level security;
alter table public.mfa_recovery_codes enable row level security;

-- Public published/read-only content.

create policy "public can read published programmes"
on public.programmes for select
to anon, authenticated
using (status = 'published');

create policy "public can read published beneficiaries"
on public.beneficiaries for select
to anon, authenticated
using (status = 'published');

create policy "public can read published testimonials"
on public.testimonials for select
to anon, authenticated
using (status = 'published');

create policy "public can read published events"
on public.events for select
to anon, authenticated
using (status = 'published');

create policy "public can read published news"
on public.news for select
to anon, authenticated
using (status = 'published');

create policy "public can read published contents"
on public.contents for select
to anon, authenticated
using (status = 'published');

create policy "public can read active footer sections"
on public.footer_sections for select
to anon, authenticated
using (is_active = true);

create policy "public can read active footer links"
on public.footer_links for select
to anon, authenticated
using (is_active = true);

create policy "public can read site settings"
on public.site_settings for select
to anon, authenticated
using (true);

create policy "public can read active social links"
on public.social_links for select
to anon, authenticated
using (is_active = true);

-- Public volunteer submission.
-- Only INSERT is allowed publicly. Admins can manage later.

create policy "public can submit volunteer application"
on public.volunteers for insert
to anon, authenticated
with check (true);

-- Public members are intentionally not exposed by default.
-- If the public beneficiary/member directory needs members later,
-- we'll add a dedicated published/public-directory policy rather than
-- exposing the entire members table.

-- Admin management policies.

create policy "admins can read profiles"
on public.profiles for select
to authenticated
using (public.has_admin_role());

create policy "admins can manage members"
on public.members for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage volunteers"
on public.volunteers for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage programmes"
on public.programmes for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage beneficiaries"
on public.beneficiaries for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage testimonials"
on public.testimonials for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage events"
on public.events for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage news"
on public.news for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage media"
on public.media for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage contents"
on public.contents for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage footer sections"
on public.footer_sections for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage footer links"
on public.footer_links for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage site settings"
on public.site_settings for all
to authenticated
using (public.has_admin_role(array['super_admin','admin']::public.user_role[]))
with check (public.has_admin_role(array['super_admin','admin']::public.user_role[]));

create policy "admins can manage social links"
on public.social_links for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can read own notifications"
on public.notifications for select
to authenticated
using (recipient_id = auth.uid());

create policy "admins can update own notifications"
on public.notifications for update
to authenticated
using (recipient_id = auth.uid())
with check (recipient_id = auth.uid());

create policy "admins can read audit logs"
on public.audit_logs for select
to authenticated
using (public.has_admin_role(array['super_admin','admin']::public.user_role[]));

create policy "super admins can manage profiles"
on public.profiles for all
to authenticated
using (public.has_admin_role(array['super_admin']::public.user_role[]))
with check (public.has_admin_role(array['super_admin']::public.user_role[]));

create policy "admins can read own mfa settings"
on public.admin_mfa for select
to authenticated
using (admin_id = auth.uid() or public.has_admin_role(array['super_admin']::public.user_role[]));

create policy "admins can manage own mfa settings"
on public.admin_mfa for all
to authenticated
using (admin_id = auth.uid() or public.has_admin_role(array['super_admin']::public.user_role[]))
with check (admin_id = auth.uid() or public.has_admin_role(array['super_admin']::public.user_role[]));

create policy "admins can manage own passkeys"
on public.admin_passkeys for all
to authenticated
using (admin_id = auth.uid() or public.has_admin_role(array['super_admin']::public.user_role[]))
with check (admin_id = auth.uid() or public.has_admin_role(array['super_admin']::public.user_role[]));

create policy "admins can manage own recovery codes"
on public.mfa_recovery_codes for all
to authenticated
using (admin_id = auth.uid() or public.has_admin_role(array['super_admin']::public.user_role[]))
with check (admin_id = auth.uid() or public.has_admin_role(array['super_admin']::public.user_role[]));

-- ============================================================
-- A SAMPLE SEED FOR THE SINGLETON SITE SETTINGS ROW
-- ============================================================

insert into public.site_settings (
  id,
  site_name,
  tagline
)
values (
  '00000000-0000-0000-0000-000000000001',
  'Adeyinka Bakare Fellowship',
  'Empowering students through opportunity and support.'
)
on conflict (id) do nothing;

commit;
