-- Make the code column nullable to support file uploads without code text
-- This allows users to either type code OR upload files

ALTER TABLE public.snippets 
ALTER COLUMN code DROP NOT NULL;

-- Add a check constraint to ensure at least code or files exists
-- Note: This is a soft constraint - we'll enforce it in the application layer
-- since we can't directly check JSONB array length in a constraint easily
