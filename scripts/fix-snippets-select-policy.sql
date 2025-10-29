-- Fix the snippets SELECT policy to allow public access to shared snippets
-- This script will drop and recreate the policy to allow:
-- 1. Users to see their own snippets
-- 2. Anyone (including anonymous users) to see public snippets

-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "snippets_select_policy" ON public.snippets;

-- Create a new SELECT policy that allows:
-- - Users to see their own snippets (auth.uid() = user_id)
-- - Anyone to see public snippets (is_public = true)
CREATE POLICY "snippets_select_policy"
  ON public.snippets
  FOR SELECT
  USING (
    auth.uid() = user_id OR is_public = true
  );

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'snippets' AND policyname = 'snippets_select_policy';
