
-- 1) Extend profiles with creator-public fields + XP/streak
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS handle TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS streak_days INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_date DATE,
  ADD COLUMN IF NOT EXISTS reputation INTEGER NOT NULL DEFAULT 0;

-- Make profiles publicly readable (creator profiles need to be public)
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are publicly viewable"
  ON public.profiles FOR SELECT
  USING (true);
GRANT SELECT ON public.profiles TO anon;

-- 2) Skill levels per category
CREATE TABLE IF NOT EXISTS public.skill_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, category)
);
GRANT SELECT ON public.skill_levels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_levels TO authenticated;
GRANT ALL ON public.skill_levels TO service_role;
ALTER TABLE public.skill_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skill levels are publicly viewable"
  ON public.skill_levels FOR SELECT USING (true);
CREATE POLICY "Users manage their own skill levels"
  ON public.skill_levels FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_skill_levels_updated_at
  BEFORE UPDATE ON public.skill_levels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Achievement catalog (public read)
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'trophy',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  threshold INTEGER NOT NULL DEFAULT 1,
  kind TEXT NOT NULL DEFAULT 'milestone',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO anon, authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements are publicly viewable"
  ON public.achievements FOR SELECT USING (true);

-- 4) User achievements unlocked
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);
GRANT SELECT ON public.user_achievements TO anon, authenticated;
GRANT INSERT, DELETE ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_achievements TO service_role;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User achievements are publicly viewable"
  ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Users insert their own achievement unlocks"
  ON public.user_achievements FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 5) Comments on guides
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 2000),
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are publicly viewable"
  ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users create their own comments"
  ON public.comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users edit their own comments"
  ON public.comments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete their own comments"
  ON public.comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_comments_guide ON public.comments(guide_id, created_at DESC);
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) Guide votes (upvotes)
CREATE TABLE IF NOT EXISTS public.guide_votes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, guide_id)
);
GRANT SELECT ON public.guide_votes TO anon, authenticated;
GRANT INSERT, DELETE ON public.guide_votes TO authenticated;
GRANT ALL ON public.guide_votes TO service_role;
ALTER TABLE public.guide_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Votes are publicly viewable"
  ON public.guide_votes FOR SELECT USING (true);
CREATE POLICY "Users manage their own votes"
  ON public.guide_votes FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Comment upvotes
CREATE TABLE IF NOT EXISTS public.comment_votes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, comment_id)
);
GRANT SELECT ON public.comment_votes TO anon, authenticated;
GRANT INSERT, DELETE ON public.comment_votes TO authenticated;
GRANT ALL ON public.comment_votes TO service_role;
ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comment votes publicly viewable"
  ON public.comment_votes FOR SELECT USING (true);
CREATE POLICY "Users manage their own comment votes"
  ON public.comment_votes FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger to keep comments.upvotes in sync
CREATE OR REPLACE FUNCTION public.sync_comment_upvotes()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments SET upvotes = upvotes + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.comments SET upvotes = GREATEST(0, upvotes - 1) WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER trg_comment_votes_sync
  AFTER INSERT OR DELETE ON public.comment_votes
  FOR EACH ROW EXECUTE FUNCTION public.sync_comment_upvotes();

-- 7) Learning paths authoring (extend existing table)
ALTER TABLE public.learning_paths
  ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_paths TO authenticated;
GRANT ALL ON public.learning_paths TO service_role;

DROP POLICY IF EXISTS "Learning paths are viewable by everyone" ON public.learning_paths;
CREATE POLICY "Published learning paths viewable by everyone"
  ON public.learning_paths FOR SELECT
  USING (is_published = true OR auth.uid() = creator_id);
CREATE POLICY "Users create their own learning paths"
  ON public.learning_paths FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators update their own learning paths"
  ON public.learning_paths FOR UPDATE TO authenticated
  USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators delete their own learning paths"
  ON public.learning_paths FOR DELETE TO authenticated
  USING (auth.uid() = creator_id);

CREATE TRIGGER update_learning_paths_updated_at
  BEFORE UPDATE ON public.learning_paths
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8) XP / level helper function (called by server fn via authed client)
-- Use a SECURITY DEFINER RPC that awards XP atomically to the calling user
CREATE OR REPLACE FUNCTION public.award_xp(_amount INTEGER, _category TEXT DEFAULT NULL)
RETURNS TABLE (new_xp INTEGER, new_level INTEGER, leveled_up BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid UUID := auth.uid();
  old_level INTEGER;
  curr_xp INTEGER;
  curr_level INTEGER;
  today DATE := (now() AT TIME ZONE 'utc')::date;
  last_date DATE;
  new_streak INTEGER;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF _amount IS NULL OR _amount <= 0 THEN
    _amount := 0;
  END IF;

  SELECT level, last_active_date, streak_days INTO old_level, last_date, new_streak
  FROM public.profiles WHERE id = uid;

  -- streak math
  IF last_date IS NULL OR last_date < today - INTERVAL '1 day' THEN
    new_streak := 1;
  ELSIF last_date = today - INTERVAL '1 day' THEN
    new_streak := COALESCE(new_streak, 0) + 1;
  END IF;

  UPDATE public.profiles
  SET xp = xp + _amount,
      level = GREATEST(1, FLOOR(SQRT((xp + _amount)::numeric / 50))::int + 1),
      last_active_date = today,
      streak_days = new_streak,
      updated_at = now()
  WHERE id = uid
  RETURNING xp, level INTO curr_xp, curr_level;

  IF _category IS NOT NULL THEN
    INSERT INTO public.skill_levels (user_id, category, xp, level)
    VALUES (uid, _category, _amount, 1)
    ON CONFLICT (user_id, category) DO UPDATE
      SET xp = public.skill_levels.xp + EXCLUDED.xp,
          level = GREATEST(1, FLOOR(SQRT((public.skill_levels.xp + EXCLUDED.xp)::numeric / 30))::int + 1),
          updated_at = now();
  END IF;

  RETURN QUERY SELECT curr_xp, curr_level, (curr_level > COALESCE(old_level, 1));
END; $$;

REVOKE ALL ON FUNCTION public.award_xp(INTEGER, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.award_xp(INTEGER, TEXT) TO authenticated;

-- 9) Seed achievement catalog
INSERT INTO public.achievements (code, title, description, icon, xp_reward, threshold, kind) VALUES
  ('first_step',     'First Step',        'Complete your first guide step.',      'footprints', 10, 1,   'steps'),
  ('first_guide',    'Done & Dusted',     'Finish your first guide.',             'check-circle', 25, 1, 'guides'),
  ('five_guides',    'Lifelong Learner',  'Finish 5 guides.',                     'graduation-cap', 75, 5, 'guides'),
  ('streak_3',       'On a Roll',         'Maintain a 3-day learning streak.',    'flame', 30, 3,   'streak'),
  ('streak_7',       'Week-Long Warrior', 'Maintain a 7-day learning streak.',    'flame', 100, 7,  'streak'),
  ('level_5',        'Rising Star',       'Reach level 5.',                       'sparkles', 50, 5, 'level'),
  ('first_comment',  'Joined the Convo',  'Post your first comment.',             'message-circle', 10, 1, 'social'),
  ('first_save',     'Curator',           'Save your first guide.',               'bookmark', 5,   1, 'collection'),
  ('first_path',     'Path Maker',        'Publish your first learning path.',    'route', 50, 1,   'creator'),
  ('first_upvote',   'Tastemaker',        'Upvote your first guide.',             'thumbs-up', 5,  1, 'social')
ON CONFLICT (code) DO NOTHING;
