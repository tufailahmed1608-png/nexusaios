-- =====================================================
-- Security Hardening Migration
-- Fixes RLS policy warnings and adds cleanup capabilities
-- =====================================================

-- Phase 1: Restrict role_definitions to admins only
DROP POLICY IF EXISTS "Authenticated users can view role definitions" ON public.role_definitions;

-- Phase 2: Restrict tenant_settings - remove public SELECT
-- (tenant_admin/admin already have ALL access via existing policy)
DROP POLICY IF EXISTS "Authenticated users can view settings" ON public.tenant_settings;

-- Phase 3: Add DELETE policies for audit/log tables

-- 3.1 User Activities - Allow users to delete their own activity history
CREATE POLICY "Users can delete their own activities"
ON public.user_activities FOR DELETE
USING (auth.uid() = user_id);

-- 3.2 Decision Audit Logs - Allow admin cleanup for compliance
CREATE POLICY "Admins can delete decision audit logs"
ON public.decision_audit_logs FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3.3 AI Output Audit Logs - Allow admin cleanup
CREATE POLICY "Admins can delete AI audit logs"
ON public.ai_output_audit_logs FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3.4 Integration Sync Logs - Allow users and admins to manage
CREATE POLICY "Users can delete logs for their integrations"
ON public.integration_sync_logs FOR DELETE
USING (EXISTS (
  SELECT 1 FROM integration_configs ic
  WHERE ic.id = integration_sync_logs.integration_id
  AND ic.user_id = auth.uid()
));

CREATE POLICY "Admins can delete any sync logs"
ON public.integration_sync_logs FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pmo'::app_role));

CREATE POLICY "Admins can update sync logs"
ON public.integration_sync_logs FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pmo'::app_role));