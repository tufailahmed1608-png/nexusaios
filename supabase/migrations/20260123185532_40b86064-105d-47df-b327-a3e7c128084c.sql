-- =====================================================
-- Fix Missing SELECT Policies After Hardening
-- =====================================================

-- Role Definitions: Add admin-only SELECT policy
CREATE POLICY "Admins can view role definitions"
ON public.role_definitions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Tenant Settings: Add admin-only SELECT policy
-- (This supplements the existing ALL policy which covers admin/tenant_admin)
CREATE POLICY "Admins can view tenant settings"
ON public.tenant_settings FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'tenant_admin'::app_role));