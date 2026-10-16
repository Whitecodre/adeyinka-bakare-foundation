-- Comprehensive notification triggers for all major actions
-- This adds notifications for security events, content changes, and data operations

BEGIN;

-- ============================================================
-- SECURITY NOTIFICATIONS
-- ============================================================

-- Passkey registered
create or replace function public.notify_passkey_registered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, type, title, message, data)
  select
    new.admin_id,
    'passkey_registered',
    'Passkey added',
    'New passkey "' || new.device_name || '" was added to your account.',
    jsonb_build_object('passkey_id', new.id, 'device_name', new.device_name);
  return new;
end;
$$;

create trigger passkey_registered_notify
after insert on public.admin_passkeys
for each row execute function public.notify_passkey_registered();

-- Passkey deleted
create or replace function public.notify_passkey_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, type, title, message, data)
  select
    old.admin_id,
    'passkey_deleted',
    'Passkey removed',
    'Passkey "' || old.device_name || '" was removed from your account.',
    jsonb_build_object('passkey_id', old.id, 'device_name', old.device_name);
  return old;
end;
$$;

create trigger passkey_deleted_notify
after delete on public.admin_passkeys
for each row execute function public.notify_passkey_deleted();

-- TOTP enabled
create or replace function public.notify_totp_enabled()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.totp_enabled = true and (old.totp_enabled is null or old.totp_enabled = false)) then
    insert into public.notifications (recipient_id, type, title, message, data)
    select
      new.admin_id,
      'totp_enabled',
      'Authenticator app enabled',
      'Two-factor authentication (authenticator app) has been enabled for your account.',
      jsonb_build_object('mfa_id', new.id);
  end if;
  return new;
end;
$$;

create trigger totp_enabled_notify
after insert or update on public.admin_mfa
for each row execute function public.notify_totp_enabled();

-- TOTP disabled
create or replace function public.notify_totp_disabled()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.totp_enabled = false and (old.totp_enabled = true)) then
    insert into public.notifications (recipient_id, type, title, message, data)
    select
      new.admin_id,
      'totp_disabled',
      'Authenticator app disabled',
      'Two-factor authentication (authenticator app) has been disabled for your account.',
      jsonb_build_object('mfa_id', new.id);
  end if;
  return new;
end;
$$;

create trigger totp_disabled_notify
after update on public.admin_mfa
for each row execute function public.notify_totp_disabled();

-- ============================================================
-- CONTENT NOTIFICATIONS
-- ============================================================

-- Programme created
create or replace function public.notify_programme_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, type, title, message, data)
  select
    p.id,
    'programme_created',
    'Programme created',
    'New programme "' || new.title || '" has been created.',
    jsonb_build_object('programme_id', new.id, 'title', new.title)
  from public.profiles p
  where p.role in ('super_admin', 'admin')
    and p.status = 'active';
  return new;
end;
$$;

create trigger programme_created_notify
after insert on public.programmes
for each row execute function public.notify_programme_created();

-- Programme updated
create or replace function public.notify_programme_updated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, type, title, message, data)
  select
    p.id,
    'programme_updated',
    'Programme updated',
    'Programme "' || new.title || '" has been updated.',
    jsonb_build_object('programme_id', new.id, 'title', new.title)
  from public.profiles p
  where p.role in ('super_admin', 'admin')
    and p.status = 'active';
  return new;
end;
$$;

create trigger programme_updated_notify
after update on public.programmes
for each row execute function public.notify_programme_updated();

-- Beneficiary created
create or replace function public.notify_beneficiary_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, type, title, message, data)
  select
    p.id,
    'beneficiary_created',
    'Beneficiary added',
    'New beneficiary "' || new.full_name || '" has been added.',
    jsonb_build_object('beneficiary_id', new.id, 'name', new.full_name)
  from public.profiles p
  where p.role in ('super_admin', 'admin')
    and p.status = 'active';
  return new;
end;
$$;

create trigger beneficiary_created_notify
after insert on public.beneficiaries
for each row execute function public.notify_beneficiary_created();

-- Event created
create or replace function public.notify_event_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, type, title, message, data)
  select
    p.id,
    'event_created',
    'Event created',
    'New event "' || new.title || '" has been created.',
    jsonb_build_object('event_id', new.id, 'title', new.title, 'start_at', new.start_at)
  from public.profiles p
  where p.role in ('super_admin', 'admin')
    and p.status = 'active';
  return new;
end;
$$;

create trigger event_created_notify
after insert on public.events
for each row execute function public.notify_event_created();

-- News created
create or replace function public.notify_news_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, type, title, message, data)
  select
    p.id,
    'news_created',
    'News article created',
    'New article "' || new.title || '" has been created.',
    jsonb_build_object('news_id', new.id, 'title', new.title)
  from public.profiles p
  where p.role in ('super_admin', 'admin')
    and p.status = 'active';
  return new;
end;
$$;

create trigger news_created_notify
after insert on public.news
for each row execute function public.notify_news_created();

-- Testimonial created
create or replace function public.notify_testimonial_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, type, title, message, data)
  select
    p.id,
    'testimonial_created',
    'Testimonial added',
    'New testimonial has been added.',
    jsonb_build_object('testimonial_id', new.id)
  from public.profiles p
  where p.role in ('super_admin', 'admin')
    and p.status = 'active';
  return new;
end;
$$;

create trigger testimonial_created_notify
after insert on public.testimonials
for each row execute function public.notify_testimonial_created();

-- Media uploaded
create or replace function public.notify_media_uploaded()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, type, title, message, data)
  select
    new.uploaded_by,
    'media_uploaded',
    'Media uploaded',
    'New media file "' || new.filename || '" has been uploaded.',
    jsonb_build_object('media_id', new.id, 'filename', new.filename, 'type', new.type)
  where new.uploaded_by is not null;
  return new;
end;
$$;

create trigger media_uploaded_notify
after insert on public.media
for each row execute function public.notify_media_uploaded();

-- ============================================================
-- GRANT EXECUTE PERMISSIONS
-- ============================================================

grant execute on function public.notify_passkey_registered() to service_role;
grant execute on function public.notify_passkey_deleted() to service_role;
grant execute on function public.notify_totp_enabled() to service_role;
grant execute on function public.notify_totp_disabled() to service_role;
grant execute on function public.notify_programme_created() to service_role;
grant execute on function public.notify_programme_updated() to service_role;
grant execute on function public.notify_beneficiary_created() to service_role;
grant execute on function public.notify_event_created() to service_role;
grant execute on function public.notify_news_created() to service_role;
grant execute on function public.notify_testimonial_created() to service_role;
grant execute on function public.notify_media_uploaded() to service_role;

COMMIT;
