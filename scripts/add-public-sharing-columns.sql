-- Add public sharing columns to snippets table
ALTER TABLE snippets
ADD COLUMN IF NOT EXISTS public_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS public_url TEXT;

-- Create index on public_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_snippets_public_id ON snippets(public_id);
