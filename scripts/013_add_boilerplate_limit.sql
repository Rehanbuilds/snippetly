-- Add boilerplate_limit column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS boilerplate_limit INTEGER DEFAULT 5;

-- Update existing free users to have boilerplate_limit of 5
UPDATE profiles 
SET boilerplate_limit = 5 
WHERE plan_type = 'free' AND boilerplate_limit IS NULL;

-- Update existing pro users to have unlimited boilerplates
UPDATE profiles 
SET boilerplate_limit = 999999 
WHERE plan_type = 'pro' AND boilerplate_limit IS NULL;

-- Create function to get boilerplate count for a user
CREATE OR REPLACE FUNCTION get_user_boilerplate_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM boilerplates WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can create boilerplate
CREATE OR REPLACE FUNCTION can_create_boilerplate(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  user_limit INTEGER;
  current_count INTEGER;
BEGIN
  SELECT plan_type, boilerplate_limit INTO user_plan, user_limit
  FROM profiles WHERE id = user_uuid;
  
  SELECT get_user_boilerplate_count(user_uuid) INTO current_count;
  
  IF user_plan = 'pro' THEN
    RETURN TRUE; -- Pro users have unlimited boilerplates
  ELSE
    RETURN current_count < user_limit; -- Free users have limits
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
