-- =====================================================
-- VERIFY PUBLIC SHARING IS WORKING
-- Run this script to check if public sharing is set up correctly
-- =====================================================

-- Check if any snippets are marked as public
SELECT 
  id,
  title,
  public_id,
  public_url,
  is_public,
  user_id,
  created_at
FROM snippets
WHERE is_public = true
ORDER BY created_at DESC
LIMIT 10;

-- Check RLS policies on snippets table
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'snippets'
ORDER BY policyname;

-- Check RLS policies on profiles table
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Check if public_id and public_url columns exist
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'snippets'
  AND column_name IN ('public_id', 'public_url', 'is_public')
ORDER BY column_name;
