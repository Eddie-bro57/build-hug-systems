-- Create video ratings and feedback table
CREATE TABLE IF NOT EXISTS public.video_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, guide_id)
);

-- Permissions
GRANT SELECT ON public.video_ratings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.video_ratings TO authenticated;
GRANT ALL ON public.video_ratings TO service_role;

-- RLS Policies
ALTER TABLE public.video_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Video ratings are viewable by everyone" 
  ON public.video_ratings FOR SELECT 
  USING (true);

CREATE POLICY "Users manage their own video ratings" 
  ON public.video_ratings FOR ALL TO authenticated
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);
