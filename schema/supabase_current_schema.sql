-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text NOT NULL,
  role USER-DEFINED NOT NULL DEFAULT 'editor'::user_role,
  status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text,
  phone text,
  department text,
  level text,
  session text,
  photo text,
  status USER-DEFINED NOT NULL DEFAULT 'active'::member_status,
  joined_at date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT members_pkey PRIMARY KEY (id)
);
CREATE TABLE public.volunteers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  department text,
  level text,
  interest text,
  message text,
  status USER-DEFINED NOT NULL DEFAULT 'new'::volunteer_status,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT volunteers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.programmes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  image text,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::record_status,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT programmes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.beneficiaries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  department text,
  level text,
  session text,
  programme text,
  photo text,
  bio text,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::record_status,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT beneficiaries_pkey PRIMARY KEY (id)
);
CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  beneficiary_id uuid,
  content text NOT NULL,
  media_url text,
  media_type USER-DEFINED,
  featured boolean NOT NULL DEFAULT false,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::record_status,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id),
  CONSTRAINT testimonials_beneficiary_id_fkey FOREIGN KEY (beneficiary_id) REFERENCES public.beneficiaries(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  location text,
  start_at timestamp with time zone NOT NULL,
  end_at timestamp with time zone,
  image text,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::record_status,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.news (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  image text,
  author_id uuid,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::record_status,
  published_at timestamp with time zone,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT news_pkey PRIMARY KEY (id),
  CONSTRAINT news_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  type USER-DEFINED NOT NULL,
  mime_type text,
  size_bytes bigint CHECK (size_bytes IS NULL OR size_bytes >= 0),
  uploaded_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT media_pkey PRIMARY KEY (id),
  CONSTRAINT media_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.contents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title text,
  content text,
  image text,
  status USER-DEFINED NOT NULL DEFAULT 'published'::record_status,
  updated_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT contents_pkey PRIMARY KEY (id),
  CONSTRAINT contents_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.footer_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT footer_sections_pkey PRIMARY KEY (id)
);
CREATE TABLE public.footer_links (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL,
  label text NOT NULL,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT footer_links_pkey PRIMARY KEY (id),
  CONSTRAINT footer_links_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.footer_sections(id)
);
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid),
  site_name text NOT NULL,
  tagline text,
  logo text,
  favicon text,
  email text,
  phone text,
  address text,
  whatsapp text,
  updated_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (id),
  CONSTRAINT site_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.social_links (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  CONSTRAINT social_links_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  read_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.admin_mfa (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL UNIQUE,
  totp_enabled boolean NOT NULL DEFAULT false,
  encrypted_totp_secret text,
  email_otp_enabled boolean NOT NULL DEFAULT false,
  passkey_enabled boolean NOT NULL DEFAULT false,
  mfa_required boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admin_mfa_pkey PRIMARY KEY (id),
  CONSTRAINT admin_mfa_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.admin_passkeys (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  credential_id text NOT NULL UNIQUE,
  public_key text NOT NULL,
  counter bigint NOT NULL DEFAULT 0,
  device_name text,
  last_used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admin_passkeys_pkey PRIMARY KEY (id),
  CONSTRAINT admin_passkeys_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.mfa_recovery_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  code_hash text NOT NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT mfa_recovery_codes_pkey PRIMARY KEY (id),
  CONSTRAINT mfa_recovery_codes_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.webauthn_challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  challenge text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['REGISTRATION'::text, 'AUTHENTICATION'::text])),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id),
  CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.mfa_email_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  code_hash text NOT NULL,
  purpose text NOT NULL CHECK (purpose = ANY (ARRAY['LOGIN'::text, 'ENABLE'::text, 'DISABLE'::text])),
  consumed_at timestamp with time zone,
  attempts integer NOT NULL DEFAULT 0,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT mfa_email_codes_pkey PRIMARY KEY (id),
  CONSTRAINT mfa_email_codes_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.email_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  to_email text NOT NULL,
  to_name text,
  subject text NOT NULL,
  template text NOT NULL,
  html_preview text,
  status text NOT NULL DEFAULT 'sent'::text CHECK (status = ANY (ARRAY['queued'::text, 'sent'::text, 'failed'::text])),
  provider text NOT NULL DEFAULT 'zoho'::text,
  provider_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid,
  error text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT email_logs_pkey PRIMARY KEY (id),
  CONSTRAINT email_logs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.admin_invites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['super_admin'::text, 'admin'::text, 'editor'::text])),
  token_hash text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  invited_by uuid,
  accepted_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admin_invites_pkey PRIMARY KEY (id),
  CONSTRAINT admin_invites_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.newsletter_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text,
  status text NOT NULL DEFAULT 'subscribed'::text CHECK (status = ANY (ARRAY['subscribed'::text, 'unsubscribed'::text, 'pending'::text])),
  source text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id)
);