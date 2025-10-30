-- Check if the snippet with public_id exists
SELECT 
  id,
  title,
  public_id,
  public_url,
  is_public,
  user_id,
  created_at
FROM snippets
WHERE public_id = 'a4eDVntibg';

-- Check all public snippets
SELECT 
  id,
  title,
  public_id,
  is_public
FROM snippets
WHERE public_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
