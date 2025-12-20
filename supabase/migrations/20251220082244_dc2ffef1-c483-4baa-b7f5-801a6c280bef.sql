-- Company branding settings table
CREATE TABLE public.company_branding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL DEFAULT 'My Company',
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#6366f1',
  secondary_color TEXT NOT NULL DEFAULT '#8b5cf6',
  accent_color TEXT NOT NULL DEFAULT '#06b6d4',
  font_heading TEXT NOT NULL DEFAULT 'Inter',
  font_body TEXT NOT NULL DEFAULT 'Inter',
  tagline TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Document templates table
CREATE TABLE public.document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('report', 'proposal', 'memo', 'invoice', 'custom')),
  content TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email templates table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('welcome', 'notification', 'reminder', 'newsletter', 'custom')),
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for company_branding
CREATE POLICY "Users can view their own branding"
ON public.company_branding FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own branding"
ON public.company_branding FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own branding"
ON public.company_branding FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own branding"
ON public.company_branding FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for document_templates
CREATE POLICY "Users can view their own document templates"
ON public.document_templates FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own document templates"
ON public.document_templates FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own document templates"
ON public.document_templates FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own document templates"
ON public.document_templates FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for email_templates
CREATE POLICY "Users can view their own email templates"
ON public.email_templates FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email templates"
ON public.email_templates FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email templates"
ON public.email_templates FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email templates"
ON public.email_templates FOR DELETE
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_company_branding_updated_at
BEFORE UPDATE ON public.company_branding
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at
BEFORE UPDATE ON public.document_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();