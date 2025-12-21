-- Add new roles to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'project_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'senior_project_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'program_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'pmo';