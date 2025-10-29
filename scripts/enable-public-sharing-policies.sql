-- =====================================================
-- ENABLE PUBLIC SNIPPET SHARING - RLS POLICIES
-- =====================================================
-- This script updates RLS policies to allow public access to:
-- 1. Snippets marked as is_public = true
-- 2. Profiles of users who own public snippets
-- =====================================================

-- =====================================================
-- SNIPPETS TABLE - Allow public access to public snippets
-- =====================================================

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "snippets_select_own" ON public.snippets;

-- Create new policy that allows:
-- 1. Users to see their own snippets (auth.uid() = user_id)
-- 2. ANYONE (including anonymous users) to see public snippets (is_public = true)
CREATE POLICY "snippets_select_own_or_public"
  ON public.snippets
  FOR SELECT
  USING (
    auth.uid() = user_id OR is_public = true
  );

-- Keep other policies unchanged (insert, update, delete remain owner-only)
-- These policies should already exist from the original migration

-- =====================================================
-- PROFILES TABLE - Allow public read access
-- =====================================================

-- Add new policy to allow anyone to read profiles
-- This is needed so anonymous users can see the author's name and bio
-- when viewing public snippets
CREATE POLICY "profiles_select_public"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Note: The existing "profiles_select_own" policy will be kept
-- Both policies will work together (users can see all profiles)

-- =====================================================
-- VERIFICATION
-- =====================================================

-- You can verify the policies were created by running:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('snippets', 'profiles')
-- ORDER BY tablename, policyname;

-- =====================================================
-- EXPECTED RESULT
-- =====================================================
-- After running this script:
-- 1. Anonymous users can SELECT snippets where is_public = true
-- 2. Anonymous users can SELECT any profile (to see author info)
-- 3. Authenticated users can still SELECT their own snippets
-- 4. Only owners can INSERT, UPDATE, DELETE their snippets
-- 5. Only owners can UPDATE, DELETE their profiles
