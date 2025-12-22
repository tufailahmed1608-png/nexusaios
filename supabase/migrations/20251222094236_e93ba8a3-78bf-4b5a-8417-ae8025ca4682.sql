-- Create table for executive decisions
CREATE TABLE public.decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  decision_type TEXT NOT NULL DEFAULT 'strategic',
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  project_name TEXT,
  amount TEXT,
  rationale TEXT,
  impact TEXT,
  stakeholders TEXT[],
  due_date TIMESTAMP WITH TIME ZONE,
  decided_at TIMESTAMP WITH TIME ZONE,
  decided_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own decisions" 
ON public.decisions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own decisions" 
ON public.decisions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decisions" 
ON public.decisions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Executives and PMO can view all decisions" 
ON public.decisions 
FOR SELECT 
USING (
  has_role(auth.uid(), 'executive'::app_role) OR 
  has_role(auth.uid(), 'pmo'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Executives can update any decision" 
ON public.decisions 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'executive'::app_role) OR 
  has_role(auth.uid(), 'pmo'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create decision audit log table
CREATE TABLE public.decision_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.decision_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view decision audit logs they have access to" 
ON public.decision_audit_logs 
FOR SELECT 
USING (
  auth.uid() = user_id OR
  has_role(auth.uid(), 'executive'::app_role) OR 
  has_role(auth.uid(), 'pmo'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can insert audit logs" 
ON public.decision_audit_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_decisions_user_id ON public.decisions(user_id);
CREATE INDEX idx_decisions_status ON public.decisions(status);
CREATE INDEX idx_decisions_created_at ON public.decisions(created_at DESC);
CREATE INDEX idx_decision_audit_logs_decision_id ON public.decision_audit_logs(decision_id);

-- Create trigger for updated_at
CREATE TRIGGER update_decisions_updated_at
BEFORE UPDATE ON public.decisions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();