-- Add icon column to projects table
ALTER TABLE projects ADD COLUMN icon TEXT DEFAULT 'hash';
