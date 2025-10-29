-- Fix RLS policies for public snippet sharing
-- This script will completely reset and recreate the RLS policies

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'snippets';

-- Drop ALL existing policies on snippets table
DROP POLICY IF EXISTS "snippets_select_own" ON public.snippets;
DROP POLICY IF EXISTS "snippets_select_own_or_public" ON public.snippets;
DROP POLICY IF EXISTS "snippets_insert_own" ON public.snippets;
DROP POLICY IF EXISTS "snippets_update_own" ON public.snippets;
DROP POLICY IF EXISTS "snippets_delete_own" ON public.snippets;

-- Create new comprehensive policies

-- 1. SELECT policy: Users can see their own snippets OR public snippets (even if not logged in)
CREATE POLICY "snippets_select_policy"
  ON public.snippets
  FOR SELECT
  USING (
    auth.uid() = user_id OR is_public = true
  );

-- 2. INSERT policy: Users can only insert their own snippets
CREATE POLICY "snippets_insert_policy"
  ON public.snippets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE policy: Users can only update their own snippets
CREATE POLICY "snippets_update_policy"
  ON public.snippets
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. DELETE policy: Users can only delete their own snippets
CREATE POLICY "snippets_delete_policy"
  ON public.snippets
  FOR DELETE
  USING (auth.uid() = user_id);

-- Verify RLS is enabled
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;

-- Show the new policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'snippets';

-- Test query: This should work for anonymous users if is_public = true
-- SELECT * FROM snippets WHERE public_id = 'test123' AND is_public = true;
