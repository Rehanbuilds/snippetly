-- Add files column to snippets table for multiple file uploads
-- This allows users to upload multiple code files or entire folders

ALTER TABLE public.snippets
ADD COLUMN IF NOT EXISTS files JSONB DEFAULT NULL;

-- Add comment to explain the structure
COMMENT ON COLUMN public.snippets.files IS 'Array of file objects with structure: [{url, name, size, type, path}]';
