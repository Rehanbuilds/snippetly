-- =====================================================
-- FINAL FIX FOR PUBLIC SNIPPET SHARING
-- This script will fix the RLS policies to allow public access
-- =====================================================

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('snippets', 'profiles')
ORDER BY tablename, policyname;

-- =====================================================
-- FIX SNIPPETS TABLE POLICIES
-- =====================================================

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "snippets_select_policy" ON public.snippets;
DROP POLICY IF EXISTS "snippets_select_own" ON public.snippets;
DROP POLICY IF EXISTS "snippets_select_own_or_public" ON public.snippets;

-- Create a new policy that allows:
-- 1. Users to see their own snippets
-- 2. ANYONE (including anonymous users) to see public snippets
CREATE POLICY "snippets_select_policy"
ON public.snippets
FOR SELECT
USING (
  auth.uid() = user_id  -- User can see their own snippets
  OR 
  is_public = true      -- Anyone can see public snippets
);

-- =====================================================
-- FIX PROFILES TABLE POLICIES
-- =====================================================

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;

-- Create a policy that allows users to see their own profile
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Create a NEW policy that allows ANYONE to read profiles
-- (needed so anonymous users can see snippet authors)
CREATE POLICY "profiles_select_public"
ON public.profiles
FOR SELECT
USING (true);  -- Allow anyone to read profiles

-- =====================================================
-- VERIFY THE POLICIES
-- =====================================================

-- Show the updated policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('snippets', 'profiles')
ORDER BY tablename, policyname;

-- Test query (this should work for anonymous users when is_public = true)
-- SELECT * FROM snippets WHERE is_public = true LIMIT 1;
