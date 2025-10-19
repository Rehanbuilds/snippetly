-- Create boilerplates table
CREATE TABLE IF NOT EXISTS public.boilerplates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security for boilerplates
ALTER TABLE public.boilerplates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for boilerplates
CREATE POLICY "boilerplates_select_own"
  ON public.boilerplates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "boilerplates_insert_own"
  ON public.boilerplates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "boilerplates_update_own"
  ON public.boilerplates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "boilerplates_delete_own"
  ON public.boilerplates FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS boilerplates_user_id_idx ON public.boilerplates(user_id);
CREATE INDEX IF NOT EXISTS boilerplates_created_at_idx ON public.boilerplates(created_at DESC);
CREATE INDEX IF NOT EXISTS boilerplates_language_idx ON public.boilerplates(language);
CREATE INDEX IF NOT EXISTS boilerplates_is_favorite_idx ON public.boilerplates(is_favorite);
