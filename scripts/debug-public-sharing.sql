-- Debug script to check public sharing status
-- Run this to see what's in the database

-- Check if columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'snippets'
AND column_name IN ('public_id', 'public_url', 'is_public')
ORDER BY column_name;

-- Check all snippets with public sharing data
SELECT 
  id,
  title,
  user_id,
  is_public,
  public_id,
  public_url,
  created_at
FROM snippets
WHERE public_id IS NOT NULL OR is_public = true
ORDER BY created_at DESC
LIMIT 20;

-- Count snippets by public status
SELECT 
  is_public,
  COUNT(*) as count,
  COUNT(CASE WHEN public_id IS NOT NULL THEN 1 END) as with_public_id,
  COUNT(CASE WHEN public_url IS NOT NULL THEN 1 END) as with_public_url
FROM snippets
GROUP BY is_public;
