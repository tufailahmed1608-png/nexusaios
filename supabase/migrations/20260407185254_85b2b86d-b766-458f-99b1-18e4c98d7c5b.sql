
-- ============================================================================
-- Create meetings_sync table for normalized meeting data from all platforms
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.meetings_sync (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'microsoft_teams',
    title TEXT NOT NULL,
    description TEXT,
    organizer TEXT,
    organizer_email TEXT,
    attendees JSONB DEFAULT '[]'::jsonb,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    status TEXT DEFAULT 'scheduled',
    join_url TEXT,
    recording_url TEXT,
    recording_status TEXT,
    transcript TEXT,
    transcript_url TEXT,
    ai_summary TEXT,
    ai_decisions JSONB DEFAULT '[]'::jsonb,
    ai_action_items JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(external_id, source)
);

CREATE INDEX idx_meetings_sync_source ON public.meetings_sync(source);
CREATE INDEX idx_meetings_sync_start_time ON public.meetings_sync(start_time);
CREATE INDEX idx_meetings_sync_status ON public.meetings_sync(status);

-- Enable RLS
ALTER TABLE public.meetings_sync ENABLE ROW LEVEL SECURITY;

-- Admins and PMO can manage all meetings
CREATE POLICY "Admins can manage meetings"
ON public.meetings_sync
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pmo'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pmo'::app_role));

-- Authorized roles can view meetings
CREATE POLICY "Authorized roles can view meetings"
ON public.meetings_sync
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = ANY(ARRAY[
            'project_manager'::app_role,
            'senior_project_manager'::app_role,
            'program_manager'::app_role,
            'pmo'::app_role,
            'executive'::app_role,
            'admin'::app_role,
            'tenant_admin'::app_role
        ])
    )
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings_sync;
