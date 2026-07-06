-- Update trigger function to auto-confirm user emails in auth.users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auto-confirm email by updating the auth.users row
  UPDATE auth.users
  SET 
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    confirmed_at = COALESCE(confirmed_at, now())
  WHERE id = NEW.id;

  -- Insert profile
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert welcome notification
  INSERT INTO public.notifications (user_id, title, body, link)
  VALUES (
    NEW.id,
    'Welcome to DoGuide! 👋',
    'We are thrilled to have you join our learning community. Complete steps to earn XP, maintain your daily streak, and master new practical skills!',
    '/paths'
  );

  RETURN NEW;
END;
$$;
