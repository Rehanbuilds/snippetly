-- First, check if columns exist and add them if they don't
DO $$ 
BEGIN
    -- Add public_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'snippets' AND column_name = 'public_id'
    ) THEN
        ALTER TABLE snippets ADD COLUMN public_id TEXT UNIQUE;
        RAISE NOTICE 'Added public_id column';
    ELSE
        RAISE NOTICE 'public_id column already exists';
    END IF;

    -- Add public_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'snippets' AND column_name = 'public_url'
    ) THEN
        ALTER TABLE snippets ADD COLUMN public_url TEXT;
        RAISE NOTICE 'Added public_url column';
    ELSE
        RAISE NOTICE 'public_url column already exists';
    END IF;

    -- Ensure is_public column exists (it should already)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'snippets' AND column_name = 'is_public'
    ) THEN
        ALTER TABLE snippets ADD COLUMN is_public BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_public column';
    ELSE
        RAISE NOTICE 'is_public column already exists';
    END IF;
END $$;

-- Create index on public_id for faster lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_snippets_public_id ON snippets(public_id);

-- Create index on is_public for faster filtering if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_snippets_is_public ON snippets(is_public);

-- Display current schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'snippets'
ORDER BY ordinal_position;
