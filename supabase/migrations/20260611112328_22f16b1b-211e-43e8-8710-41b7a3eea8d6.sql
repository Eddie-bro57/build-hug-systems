-- =========================
-- GUIDES
-- =========================
CREATE TABLE public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL DEFAULT 'Easy',
  time_minutes integer NOT NULL DEFAULT 15,
  materials jsonb NOT NULL DEFAULT '[]'::jsonb,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  tips jsonb NOT NULL DEFAULT '[]'::jsonb,
  video_query text,
  hero_image text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published boolean NOT NULL DEFAULT true,
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_guides_category ON public.guides(category);
CREATE INDEX idx_guides_published ON public.guides(is_published, created_at DESC);

GRANT SELECT ON public.guides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.guides TO authenticated;
GRANT ALL ON public.guides TO service_role;

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published guides are viewable by everyone"
  ON public.guides FOR SELECT
  USING (is_published = true OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can create guides"
  ON public.guides FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id OR author_id IS NULL);

CREATE POLICY "Authors can update their own guides"
  ON public.guides FOR UPDATE TO authenticated
  USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own guides"
  ON public.guides FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

CREATE TRIGGER trg_guides_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- GUIDE PROGRESS
-- =========================
CREATE TABLE public.guide_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  completed_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, guide_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.guide_progress TO authenticated;
GRANT ALL ON public.guide_progress TO service_role;

ALTER TABLE public.guide_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own progress"
  ON public.guide_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_guide_progress_updated_at
  BEFORE UPDATE ON public.guide_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- SAVED GUIDES
-- =========================
CREATE TABLE public.saved_guides (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, guide_id)
);

GRANT SELECT, INSERT, DELETE ON public.saved_guides TO authenticated;
GRANT ALL ON public.saved_guides TO service_role;

ALTER TABLE public.saved_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own saved guides"
  ON public.saved_guides FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =========================
-- CHALLENGES
-- =========================
CREATE TABLE public.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  active_on date NOT NULL DEFAULT CURRENT_DATE,
  guide_id uuid REFERENCES public.guides(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.challenges TO anon, authenticated;
GRANT ALL ON public.challenges TO service_role;

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenges are viewable by everyone"
  ON public.challenges FOR SELECT USING (true);

-- =========================
-- LEARNING PATHS
-- =========================
CREATE TABLE public.learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  guide_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  hero_image text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.learning_paths TO anon, authenticated;
GRANT ALL ON public.learning_paths TO service_role;

ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Learning paths are viewable by everyone"
  ON public.learning_paths FOR SELECT USING (true);
