-- Check if public_id and public_url columns exist in snippets table
DO $$
BEGIN
    -- Check and add public_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'snippets' 
        AND column_name = 'public_id'
    ) THEN
        ALTER TABLE public.snippets ADD COLUMN public_id TEXT;
        RAISE NOTICE 'Added public_id column';
    ELSE
        RAISE NOTICE 'public_id column already exists';
    END IF;

    -- Check and add public_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'snippets' 
        AND column_name = 'public_url'
    ) THEN
        ALTER TABLE public.snippets ADD COLUMN public_url TEXT;
        RAISE NOTICE 'Added public_url column';
    ELSE
        RAISE NOTICE 'public_url column already exists';
    END IF;

    -- Create index on public_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND tablename = 'snippets'
        AND indexname = 'idx_snippets_public_id'
    ) THEN
        CREATE INDEX idx_snippets_public_id ON public.snippets(public_id);
        RAISE NOTICE 'Created index on public_id';
    ELSE
        RAISE NOTICE 'Index on public_id already exists';
    END IF;

    -- Create index on is_public if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND tablename = 'snippets'
        AND indexname = 'idx_snippets_is_public'
    ) THEN
        CREATE INDEX idx_snippets_is_public ON public.snippets(is_public);
        RAISE NOTICE 'Created index on is_public';
    ELSE
        RAISE NOTICE 'Index on is_public already exists';
    END IF;
END $$;

-- Display current schema for verification
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'snippets'
    AND column_name IN ('public_id', 'public_url', 'is_public')
ORDER BY 
    column_name;
