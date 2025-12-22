-- Create tenant settings table for feature toggles and AI scope
CREATE TABLE public.tenant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  category text NOT NULL DEFAULT 'general',
  updated_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;

-- Only tenant_admin and admin can manage settings
CREATE POLICY "Tenant admins can manage settings"
ON public.tenant_settings
FOR ALL
USING (has_role(auth.uid(), 'tenant_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'tenant_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- All authenticated users can view settings (to check feature toggles)
CREATE POLICY "Authenticated users can view settings"
ON public.tenant_settings
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Insert default feature toggles
INSERT INTO public.tenant_settings (setting_key, setting_value, description, category) VALUES
('smart_inbox_enabled', '{"enabled": true}'::jsonb, 'Enable/disable Smart Inbox feature', 'features'),
('smart_inbox_aggregate_only', '{"enabled": true}'::jsonb, 'Show only aggregate communication signals (no individual sentiment)', 'features'),
('smart_inbox_no_hr_usage', '{"enabled": true}'::jsonb, 'Prevent HR/performance usage of inbox data', 'governance'),
('risk_signals_evidence_based', '{"enabled": true}'::jsonb, 'Show only evidence-based risk indicators', 'governance'),
('risk_signals_no_people_analytics', '{"enabled": true}'::jsonb, 'Disable predictive people analytics', 'governance'),
('ai_human_approval_required', '{"enabled": true}'::jsonb, 'Require human approval for all AI outputs', 'ai'),
('pilot_mode_enabled', '{"enabled": false}'::jsonb, 'Enable pilot mode with watermarks and time-boxing', 'pilot');

-- Create trigger for updated_at
CREATE TRIGGER update_tenant_settings_updated_at
BEFORE UPDATE ON public.tenant_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert tenant_admin role definition
INSERT INTO public.role_definitions (role, display_name, description, hierarchy_level, permissions)
VALUES (
  'tenant_admin',
  'Tenant Administrator',
  'Manages tenant-wide settings including AI scope, security controls, and feature toggles',
  85,
  '["manage_tenant_settings", "manage_feature_toggles", "manage_ai_scope", "view_all_users", "manage_pilot_mode"]'::jsonb
) ON CONFLICT DO NOTHING;