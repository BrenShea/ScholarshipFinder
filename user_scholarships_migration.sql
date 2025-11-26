-- Create user_scholarships table to track applied/saved scholarships
CREATE TABLE IF NOT EXISTS user_scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  scholarship_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('applied', 'saved', 'hidden')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, scholarship_id)
);

-- Enable RLS
ALTER TABLE user_scholarships ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own scholarships"
  ON user_scholarships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scholarships"
  ON user_scholarships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scholarships"
  ON user_scholarships FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scholarships"
  ON user_scholarships FOR DELETE
  USING (auth.uid() = user_id);
