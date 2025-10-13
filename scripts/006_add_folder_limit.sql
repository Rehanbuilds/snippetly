-- Add folder_limit column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS folder_limit INTEGER DEFAULT 5;

-- Update existing free users to have folder_limit of 5
UPDATE profiles 
SET folder_limit = 5 
WHERE plan_type = 'free' AND folder_limit IS NULL;

-- Update existing pro users to have unlimited folders
UPDATE profiles 
SET folder_limit = 999999 
WHERE plan_type = 'pro' AND folder_limit IS NULL;

-- Create function to get folder count for a user
CREATE OR REPLACE FUNCTION get_user_folder_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM folders WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can create folder
CREATE OR REPLACE FUNCTION can_create_folder(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  user_limit INTEGER;
  current_count INTEGER;
BEGIN
  SELECT plan_type, folder_limit INTO user_plan, user_limit
  FROM profiles WHERE id = user_uuid;
  
  SELECT get_user_folder_count(user_uuid) INTO current_count;
  
  IF user_plan = 'pro' THEN
    RETURN TRUE; -- Pro users have unlimited folders
  ELSE
    RETURN current_count < user_limit; -- Free users have limits
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
