-- Create integration_configs table for storing connection settings
CREATE TABLE public.integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  integration_type TEXT NOT NULL,
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sync_frequency TEXT DEFAULT 'manual',
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create integration_sync_logs table for tracking sync history
CREATE TABLE public.integration_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES public.integration_configs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  sync_details JSONB DEFAULT '{}'
);

-- Create file_imports table for tracking uploaded file processing
CREATE TABLE public.file_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT,
  status TEXT DEFAULT 'pending',
  parsed_data JSONB,
  mapping_config JSONB,
  records_imported INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.integration_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_imports ENABLE ROW LEVEL SECURITY;

-- RLS policies for integration_configs
CREATE POLICY "Users can view their own integrations"
ON public.integration_configs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own integrations"
ON public.integration_configs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations"
ON public.integration_configs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations"
ON public.integration_configs FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all integrations"
ON public.integration_configs FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pmo'::app_role));

-- RLS policies for integration_sync_logs
CREATE POLICY "Users can view logs for their integrations"
ON public.integration_sync_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.integration_configs ic
    WHERE ic.id = integration_id AND ic.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create logs for their integrations"
ON public.integration_sync_logs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.integration_configs ic
    WHERE ic.id = integration_id AND ic.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all sync logs"
ON public.integration_sync_logs FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pmo'::app_role));

-- RLS policies for file_imports
CREATE POLICY "Users can view their own file imports"
ON public.file_imports FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own file imports"
ON public.file_imports FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own file imports"
ON public.file_imports FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own file imports"
ON public.file_imports FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all file imports"
ON public.file_imports FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pmo'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_integration_configs_updated_at
BEFORE UPDATE ON public.integration_configs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_file_imports_updated_at
BEFORE UPDATE ON public.file_imports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for file imports
INSERT INTO storage.buckets (id, name, public) VALUES ('file-imports', 'file-imports', false);

-- Storage policies for file-imports bucket
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'file-imports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
USING (bucket_id = 'file-imports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'file-imports' AND auth.uid()::text = (storage.foldername(name))[1]);