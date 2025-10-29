-- Test script to verify public snippet sharing is working

-- 1. Check if any snippets have public sharing enabled
SELECT 
  id,
  title,
  user_id,
  public_id,
  public_url,
  is_public,
  created_at
FROM public.snippets
WHERE is_public = true
ORDER BY created_at DESC
LIMIT 10;

-- 2. Check if public_id and public_url columns exist and have data
SELECT 
  COUNT(*) as total_snippets,
  COUNT(public_id) as snippets_with_public_id,
  COUNT(CASE WHEN is_public = true THEN 1 END) as public_snippets
FROM public.snippets;

-- 3. Show current RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'snippets'
ORDER BY policyname;

-- 4. Test if a specific public_id exists (replace 'YOUR_PUBLIC_ID' with actual value)
-- SELECT 
--   id,
--   title,
--   public_id,
--   is_public
-- FROM public.snippets
-- WHERE public_id = 'YOUR_PUBLIC_ID';
