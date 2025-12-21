-- Create a table to store role metadata/descriptions
CREATE TABLE IF NOT EXISTS public.role_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text NOT NULL,
  hierarchy_level integer NOT NULL DEFAULT 0,
  permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.role_definitions ENABLE ROW LEVEL SECURITY;

-- Everyone can read role definitions
CREATE POLICY "Anyone can view role definitions"
ON public.role_definitions
FOR SELECT
TO authenticated
USING (true);

-- Only admins/PMO can manage role definitions
CREATE POLICY "Admins can manage role definitions"
ON public.role_definitions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'pmo'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'pmo'));

-- Insert role definitions
INSERT INTO public.role_definitions (role, display_name, description, hierarchy_level, permissions) VALUES
  ('user', 'User', 'Basic user with limited access', 1, '["view_own_projects", "view_own_tasks"]'::jsonb),
  ('project_manager', 'Project Manager', 'Manages individual projects, tasks, and team members', 2, '["view_own_projects", "manage_own_projects", "manage_tasks", "view_team", "manage_documents"]'::jsonb),
  ('senior_project_manager', 'Senior Project Manager', 'Oversees Project Managers and multiple projects', 3, '["view_all_projects", "manage_projects", "view_project_managers", "approve_budgets", "manage_risks"]'::jsonb),
  ('program_manager', 'Program Manager', 'Manages related projects within a program and coordinates with Project Managers', 4, '["view_program_projects", "manage_programs", "coordinate_project_managers", "strategic_planning", "resource_allocation"]'::jsonb),
  ('pmo', 'PMO', 'Overall governance of project management department, standards, and methodology', 5, '["full_access", "manage_methodology", "portfolio_management", "governance", "manage_roles"]'::jsonb),
  ('admin', 'Administrator', 'Full system administrator with all permissions', 10, '["full_access", "system_settings", "user_management"]'::jsonb);

-- Add trigger for updated_at
CREATE TRIGGER update_role_definitions_updated_at
BEFORE UPDATE ON public.role_definitions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();