-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  age INTEGER,
  graduation_year INTEGER,
  is_transfer BOOLEAN DEFAULT false,
  quiz_answers JSONB DEFAULT '{}'::jsonb,
  base_essay TEXT,
  gemini_api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Backfill profiles for existing users (Fix for "none of this syncs")
INSERT INTO public.profiles (id, full_name)
SELECT id, raw_user_meta_data->>'full_name'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- 2. SCHOLARSHIPS TABLE (for syncing scraped data)
CREATE TABLE IF NOT EXISTS scholarships (
  id TEXT PRIMARY KEY, -- Stable ID from scraping
  name TEXT NOT NULL,
  amount INTEGER DEFAULT 0,
  deadline TIMESTAMP WITH TIME ZONE,
  link TEXT,
  description TEXT,
  requirements TEXT[],
  university_id TEXT, -- provider
  region TEXT DEFAULT 'National',
  categories TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for scholarships
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- Scholarships Policies (Public read, Service role write)
DROP POLICY IF EXISTS "Public read access to scholarships" ON scholarships;
CREATE POLICY "Public read access to scholarships"
  ON scholarships FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert/update (if client-side scraping is used)
DROP POLICY IF EXISTS "Authenticated users can sync scholarships" ON scholarships;
CREATE POLICY "Authenticated users can sync scholarships"
  ON scholarships FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update scholarships" ON scholarships;
CREATE POLICY "Authenticated users can update scholarships"
  ON scholarships FOR UPDATE
  TO authenticated
  USING (true);


-- 3. USER_SCHOLARSHIPS TABLE (Tracking Applied/Hidden status)
CREATE TABLE IF NOT EXISTS user_scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scholarship_id TEXT NOT NULL, -- References scholarships(id) logically, but maybe loose FK if scraping varies
  status TEXT NOT NULL CHECK (status IN ('applied', 'saved', 'hidden')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, scholarship_id)
);

-- Enable RLS for user_scholarships
ALTER TABLE user_scholarships ENABLE ROW LEVEL SECURITY;

-- User Scholarships Policies
DROP POLICY IF EXISTS "Users can view their own scholarships" ON user_scholarships;
CREATE POLICY "Users can view their own scholarships"
  ON user_scholarships FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own scholarships" ON user_scholarships;
CREATE POLICY "Users can insert their own scholarships"
  ON user_scholarships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own scholarships" ON user_scholarships;
CREATE POLICY "Users can update their own scholarships"
  ON user_scholarships FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own scholarships" ON user_scholarships;
CREATE POLICY "Users can delete their own scholarships"
  ON user_scholarships FOR DELETE
  USING (auth.uid() = user_id);


-- 4. APP CONFIG (Legacy/Optional)
CREATE TABLE IF NOT EXISTS app_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to app_config" ON app_config;
CREATE POLICY "Allow public read access to app_config"
  ON app_config FOR SELECT
  TO public
  USING (true);
