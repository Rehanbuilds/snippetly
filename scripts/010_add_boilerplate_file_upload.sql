-- Add file upload columns to boilerplates table
ALTER TABLE boilerplates
ADD COLUMN file_url TEXT,
ADD COLUMN file_name TEXT,
ADD COLUMN file_size BIGINT,
ADD COLUMN file_type TEXT;

-- Add comment to explain the columns
COMMENT ON COLUMN boilerplates.file_url IS 'URL of the uploaded file from Vercel Blob';
COMMENT ON COLUMN boilerplates.file_name IS 'Original filename of the uploaded file';
COMMENT ON COLUMN boilerplates.file_size IS 'File size in bytes';
COMMENT ON COLUMN boilerplates.file_type IS 'MIME type of the uploaded file';
