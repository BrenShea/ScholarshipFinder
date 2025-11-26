-- Create the app_config table in Supabase
CREATE TABLE IF NOT EXISTS app_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to app_config"
ON app_config FOR SELECT
TO public
USING (true);

-- Create policy to allow public insert/update (for the API key input UI)
CREATE POLICY "Allow public upsert access to app_config"
ON app_config FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access to app_config"
ON app_config FOR UPDATE
TO public
USING (true);

-- Insert the initial Gemini API key (replace with your actual key)
-- You can do this manually in the Supabase dashboard or run this SQL
INSERT INTO app_config (key, value) 
VALUES ('gemini_api_key', 'YOUR_GEMINI_API_KEY_HERE')
ON CONFLICT (key) DO NOTHING;
