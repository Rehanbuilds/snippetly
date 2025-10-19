-- Add support for multiple files in boilerplates
-- Replace single file columns with a files JSONB array

-- Add new files column to store array of file objects
ALTER TABLE boilerplates
ADD COLUMN files JSONB DEFAULT '[]'::jsonb;

-- Comment to explain the structure
COMMENT ON COLUMN boilerplates.files IS 'Array of uploaded files with metadata: [{url, name, size, type, path}]';

-- Note: We keep the old file_* columns for backward compatibility
-- They can be removed in a future migration after data migration
