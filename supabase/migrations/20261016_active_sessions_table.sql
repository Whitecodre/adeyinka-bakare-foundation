-- Create active sessions table for tracking admin sessions
-- This allows admins to see and manage their active sessions

BEGIN;

CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_token text NOT NULL UNIQUE,
  ip_address text,
  user_agent text,
  device_type text,
  browser text,
  os text,
  location_country text,
  location_city text,
  is_current boolean DEFAULT false,
  last_activity timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days')
);

-- Index for faster lookups by admin_id
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON public.admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_session_token ON public.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);

-- RLS Policies
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Admins can view their own sessions
CREATE POLICY "admins can view own sessions"
  ON public.admin_sessions FOR SELECT
  USING (admin_id = (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Admins can delete their own sessions
CREATE POLICY "admins can delete own sessions"
  ON public.admin_sessions FOR DELETE
  USING (admin_id = (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Function to insert session on login
CREATE OR REPLACE FUNCTION public.insert_admin_session(
  p_admin_id uuid,
  p_session_token text,
  p_ip_address text DEFAULT null,
  p_user_agent text DEFAULT null
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id uuid;
  v_device_type text;
  v_browser text;
  v_os text;
BEGIN
  -- Parse user agent to extract device info (simple parsing)
  v_device_type := CASE
    WHEN p_user_agent ~* 'Mobile|Android|iPhone' THEN 'mobile'
    WHEN p_user_agent ~* 'Tablet|iPad' THEN 'tablet'
    ELSE 'desktop'
  END;

  v_browser := CASE
    WHEN p_user_agent ~* 'Chrome' THEN 'Chrome'
    WHEN p_user_agent ~* 'Firefox' THEN 'Firefox'
    WHEN p_user_agent ~* 'Safari' THEN 'Safari'
    WHEN p_user_agent ~* 'Edge' THEN 'Edge'
    ELSE 'Other'
  END;

  v_os := CASE
    WHEN p_user_agent ~* 'Windows' THEN 'Windows'
    WHEN p_user_agent ~* 'Mac OS X' THEN 'macOS'
    WHEN p_user_agent ~* 'Android' THEN 'Android'
    WHEN p_user_agent ~* 'iOS' THEN 'iOS'
    WHEN p_user_agent ~* 'Linux' THEN 'Linux'
    ELSE 'Other'
  END;

  -- Insert the session
  INSERT INTO public.admin_sessions (
    admin_id,
    session_token,
    ip_address,
    user_agent,
    device_type,
    browser,
    os,
    is_current,
    expires_at
  )
  VALUES (
    p_admin_id,
    p_session_token,
    p_ip_address,
    p_user_agent,
    v_device_type,
    v_browser,
    v_os,
    true,
    now() + interval '30 days'
  )
  RETURNING id INTO v_session_id;

  -- Mark other sessions as not current
  UPDATE public.admin_sessions
  SET is_current = false
  WHERE admin_id = p_admin_id AND id != v_session_id;

  RETURN v_session_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.insert_admin_session TO authenticated;

-- Function to update session last activity
CREATE OR REPLACE FUNCTION public.update_session_activity(p_session_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.admin_sessions
  SET last_activity = now()
  WHERE session_token = p_session_token;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_session_activity TO authenticated;

-- Function to delete a session
CREATE OR REPLACE FUNCTION public.delete_admin_session(p_session_id uuid, p_admin_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.admin_sessions
  WHERE id = p_session_id AND admin_id = p_admin_id;
  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_admin_session TO authenticated;

-- Function to delete all sessions except current
CREATE OR REPLACE FUNCTION public.delete_other_sessions(p_admin_id uuid)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted_count int;
BEGIN
  DELETE FROM public.admin_sessions
  WHERE admin_id = p_admin_id AND is_current = false;
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_other_sessions TO authenticated;

COMMIT;
