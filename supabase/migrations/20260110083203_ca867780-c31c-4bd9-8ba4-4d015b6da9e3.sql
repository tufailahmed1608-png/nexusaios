-- Create enum for signal categories
CREATE TYPE signal_category AS ENUM ('project', 'communication', 'governance');

-- Create enum for signal severity
CREATE TYPE signal_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Create enterprise_signals table to store all synthetic and real signals
CREATE TABLE public.enterprise_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signal_category signal_category NOT NULL,
  signal_type TEXT NOT NULL,
  severity signal_severity NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL DEFAULT 'synthetic',
  project_name TEXT,
  stakeholder TEXT,
  metadata JSONB DEFAULT '{}',
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.enterprise_signals ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can view all signals"
ON public.enterprise_signals
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert signals"
ON public.enterprise_signals
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update signals"
ON public.enterprise_signals
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete signals"
ON public.enterprise_signals
FOR DELETE
TO authenticated
USING (true);

-- Create indexes for efficient querying
CREATE INDEX idx_signals_category ON public.enterprise_signals(signal_category);
CREATE INDEX idx_signals_severity ON public.enterprise_signals(severity);
CREATE INDEX idx_signals_created ON public.enterprise_signals(created_at DESC);
CREATE INDEX idx_signals_resolved ON public.enterprise_signals(is_resolved);

-- Add trigger for updated_at
CREATE TRIGGER update_enterprise_signals_updated_at
BEFORE UPDATE ON public.enterprise_signals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for signals
ALTER PUBLICATION supabase_realtime ADD TABLE public.enterprise_signals;