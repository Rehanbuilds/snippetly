-- Drop both old and new policies to allow re-running the script
DROP POLICY IF EXISTS "snippets_select_own" ON public.snippets;
DROP POLICY IF EXISTS "snippets_select_own_or_public" ON public.snippets;

-- Create a new policy that allows users to see their own snippets OR public snippets
CREATE POLICY "snippets_select_own_or_public"
  ON public.snippets FOR SELECT
  USING (
    auth.uid() = user_id OR is_public = true
  );

-- Add index on public_id for faster lookups
CREATE INDEX IF NOT EXISTS snippets_public_id_idx ON public.snippets(public_id) WHERE public_id IS NOT NULL;

-- Add index on is_public for faster filtering
CREATE INDEX IF NOT EXISTS snippets_is_public_idx ON public.snippets(is_public) WHERE is_public = true;

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'snippets' AND policyname = 'snippets_select_own_or_public';
