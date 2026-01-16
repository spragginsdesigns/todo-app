-- Add user_id column to projects table
ALTER TABLE projects ADD COLUMN user_id TEXT;

-- Add user_id column to todos table
ALTER TABLE todos ADD COLUMN user_id TEXT;

-- Create indexes for user_id
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_todos_user ON todos(user_id);

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Allow all operations for anon" ON projects;
DROP POLICY IF EXISTS "Allow all operations for anon" ON todos;

-- Create new RLS policies for authenticated users
-- For projects: users can only see and modify their own projects
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE TO authenticated
  USING (user_id = auth.jwt() ->> 'sub')
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- For todos: users can only see and modify their own todos
CREATE POLICY "Users can view their own todos" ON todos
  FOR SELECT TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own todos" ON todos
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own todos" ON todos
  FOR UPDATE TO authenticated
  USING (user_id = auth.jwt() ->> 'sub')
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own todos" ON todos
  FOR DELETE TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- Keep anon policies for development (remove in production)
CREATE POLICY "Allow anon read for development" ON projects
  FOR SELECT TO anon
  USING (user_id IS NULL);

CREATE POLICY "Allow anon write for development" ON projects
  FOR ALL TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Allow anon read for development" ON todos
  FOR SELECT TO anon
  USING (user_id IS NULL);

CREATE POLICY "Allow anon write for development" ON todos
  FOR ALL TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);
