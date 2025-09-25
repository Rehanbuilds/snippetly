-- Add plan information to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_status TEXT DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS snippet_limit INTEGER DEFAULT 50;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS paddle_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create payments table to track transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paddle_transaction_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for payments
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to get snippet count for a user
CREATE OR REPLACE FUNCTION get_user_snippet_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM snippets WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can create snippet
CREATE OR REPLACE FUNCTION can_create_snippet(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  user_limit INTEGER;
  current_count INTEGER;
BEGIN
  SELECT plan_type, snippet_limit INTO user_plan, user_limit
  FROM profiles WHERE id = user_uuid;
  
  SELECT get_user_snippet_count(user_uuid) INTO current_count;
  
  IF user_plan = 'pro' THEN
    RETURN TRUE; -- Pro users have unlimited snippets
  ELSE
    RETURN current_count < user_limit; -- Free users have limits
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
