-- =====================================================
-- COMPLETE FIX FOR PUBLIC SNIPPET SHARING
-- This script will fix all RLS policies to enable public sharing
-- =====================================================

-- Step 1: Drop all existing snippet policies
DROP POLICY IF EXISTS "snippets_select_own" ON public.snippets;
DROP POLICY IF EXISTS "snippets_select_policy" ON public.snippets;
DROP POLICY IF EXISTS "snippets_select_own_or_public" ON public.snippets;
DROP POLICY IF EXISTS "Allow public read access for public snippets" ON public.snippets;

-- Step 2: Create a new SELECT policy that allows BOTH:
-- - Users to see their own snippets
-- - ANYONE (including anonymous users) to see public snippets
CREATE POLICY "snippets_select_own_or_public"
  ON public.snippets
  FOR SELECT
  USING (
    auth.uid() = user_id  -- User can see their own snippets
    OR 
    is_public = true      -- Anyone can see public snippets
  );

-- Step 3: Fix profiles table to allow public read access
-- Drop existing restrictive policy
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;

-- Create new policy that allows:
-- - Users to see their own profile
-- - ANYONE to see any profile (needed for public snippet authors)
CREATE POLICY "profiles_select_own_or_public"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id  -- User can see their own profile
    OR 
    true             -- Anyone can see any profile
  );

-- Step 4: Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('snippets', 'profiles')
ORDER BY tablename, policyname;

-- Step 5: Test query (this should work for anonymous users)
-- SELECT * FROM snippets WHERE is_public = true LIMIT 1;
-- SELECT * FROM profiles LIMIT 1;
