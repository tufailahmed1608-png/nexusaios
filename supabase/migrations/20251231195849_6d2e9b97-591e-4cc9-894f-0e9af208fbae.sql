-- Create table for synced project data from external systems
CREATE TABLE public.projects_sync (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'microsoft_project',
    name TEXT NOT NULL,
    description TEXT,
    health TEXT NOT NULL DEFAULT 'on-track',
    progress INTEGER DEFAULT 0,
    budget NUMERIC DEFAULT 0,
    spent NUMERIC DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    priority TEXT DEFAULT 'medium',
    category TEXT,
    team_data JSONB DEFAULT '[]'::jsonb,
    milestones_data JSONB DEFAULT '[]'::jsonb,
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(external_id, source)
);

-- Create table for synced KPI data
CREATE TABLE public.kpis_sync (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL DEFAULT 'microsoft_project',
    title TEXT NOT NULL,
    value TEXT NOT NULL,
    change NUMERIC DEFAULT 0,
    trend TEXT DEFAULT 'stable',
    icon TEXT DEFAULT 'activity',
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for synced task data
CREATE TABLE public.tasks_sync (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'microsoft_project',
    project_external_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo',
    priority TEXT DEFAULT 'medium',
    assignee TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT '{}',
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(external_id, source)
);

-- Create index for faster lookups
CREATE INDEX idx_projects_sync_source ON public.projects_sync(source);
CREATE INDEX idx_projects_sync_external_id ON public.projects_sync(external_id);
CREATE INDEX idx_kpis_sync_source ON public.kpis_sync(source);
CREATE INDEX idx_tasks_sync_source ON public.tasks_sync(source);
CREATE INDEX idx_tasks_sync_project ON public.tasks_sync(project_external_id);

-- Enable RLS
ALTER TABLE public.projects_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks_sync ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users to read synced data
CREATE POLICY "Authenticated users can view synced projects"
ON public.projects_sync FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view synced kpis"
ON public.kpis_sync FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view synced tasks"
ON public.tasks_sync FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Policies for admins to manage synced data
CREATE POLICY "Admins can manage synced projects"
ON public.projects_sync FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'pmo'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'pmo'));

CREATE POLICY "Admins can manage synced kpis"
ON public.kpis_sync FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'pmo'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'pmo'));

CREATE POLICY "Admins can manage synced tasks"
ON public.tasks_sync FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'pmo'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'pmo'));

-- Add triggers for updated_at
CREATE TRIGGER update_projects_sync_updated_at
    BEFORE UPDATE ON public.projects_sync
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kpis_sync_updated_at
    BEFORE UPDATE ON public.kpis_sync
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_sync_updated_at
    BEFORE UPDATE ON public.tasks_sync
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();