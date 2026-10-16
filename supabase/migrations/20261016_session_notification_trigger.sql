-- Add notification trigger for new admin session
-- Notifies the admin when a new session is created

BEGIN;

CREATE OR REPLACE FUNCTION public.notify_new_session()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_device_info text;
BEGIN
  -- Build device info string
  v_device_info := CONCAT(
    COALESCE(NEW.device_type, 'Unknown device'),
    ' - ',
    COALESCE(NEW.browser, 'Unknown browser'),
    ' on ',
    COALESCE(NEW.os, 'Unknown OS')
  );

  -- Insert notification for the admin
  INSERT INTO public.notifications (
    recipient_id,
    type,
    title,
    message,
    data
  )
  VALUES (
    NEW.admin_id,
    'security',
    'New Sign-in Detected',
    'A new session was created on your account.',
    jsonb_build_object(
      'session_id', NEW.id,
      'device', v_device_info,
      'ip_address', COALESCE(NEW.ip_address, 'Unknown'),
      'location', COALESCE(NEW.location_city, 'Unknown'),
      'created_at', NEW.created_at
    )
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_new_session
  AFTER INSERT ON public.admin_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_session();

COMMIT;
