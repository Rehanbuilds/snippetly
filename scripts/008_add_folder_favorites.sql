-- Add is_favorite column to folders table
ALTER TABLE folders
ADD COLUMN is_favorite BOOLEAN DEFAULT false;

-- Add index for faster queries on favorite folders
CREATE INDEX idx_folders_user_favorite ON folders(user_id, is_favorite) WHERE is_favorite = true;

-- Add comment
COMMENT ON COLUMN folders.is_favorite IS 'Whether the folder is marked as favorite by the user';
