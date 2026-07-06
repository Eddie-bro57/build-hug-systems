-- Add video_id column to guides table
ALTER TABLE public.guides ADD COLUMN IF NOT EXISTS video_id TEXT;
