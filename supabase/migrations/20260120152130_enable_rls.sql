-- Fix: Enable RLS on tables (policies exist but RLS was not enabled)
-- This is idempotent - safe to run even if RLS is already enabled

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
