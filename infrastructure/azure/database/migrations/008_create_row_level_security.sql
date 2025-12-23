-- ============================================================================
-- Migration: 008_create_row_level_security.sql
-- Description: Create Row Level Security policies for Nexus OS
-- Target: Azure Database for PostgreSQL Flexible Server
-- Note: Azure PostgreSQL supports RLS, but requires app-level user context
-- ============================================================================

-- ============================================================================
-- IMPORTANT: Row Level Security in Azure PostgreSQL
-- ============================================================================
-- Unlike Supabase which uses auth.uid(), Azure PostgreSQL requires you to
-- set the current user context in your application. Use:
--
--   SET LOCAL app.current_user_id = 'uuid-here';
--
-- Or use a function to get the current user:
-- ============================================================================

-- Function to get current user ID from session variable
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
    SELECT NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID
$$;

COMMENT ON FUNCTION current_user_id IS 'Get current user ID from session variable';

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_output_audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Profiles Policies
-- ============================================================================

CREATE POLICY profiles_select_own ON profiles
    FOR SELECT USING (user_id = current_user_id());

CREATE POLICY profiles_select_admin ON profiles
    FOR SELECT USING (has_role(current_user_id(), 'admin'));

CREATE POLICY profiles_insert_own ON profiles
    FOR INSERT WITH CHECK (user_id = current_user_id());

CREATE POLICY profiles_update_own ON profiles
    FOR UPDATE USING (user_id = current_user_id());

-- ============================================================================
-- User Roles Policies
-- ============================================================================

CREATE POLICY user_roles_select_own ON user_roles
    FOR SELECT USING (user_id = current_user_id());

CREATE POLICY user_roles_select_admin ON user_roles
    FOR SELECT USING (has_role(current_user_id(), 'admin'));

CREATE POLICY user_roles_insert_admin ON user_roles
    FOR INSERT WITH CHECK (has_role(current_user_id(), 'admin'));

CREATE POLICY user_roles_delete_admin ON user_roles
    FOR DELETE USING (has_role(current_user_id(), 'admin'));

-- ============================================================================
-- Role Definitions Policies
-- ============================================================================

CREATE POLICY role_definitions_select_all ON role_definitions
    FOR SELECT USING (TRUE);

CREATE POLICY role_definitions_all_admin ON role_definitions
    FOR ALL USING (
        has_role(current_user_id(), 'admin') OR 
        has_role(current_user_id(), 'pmo')
    );

-- ============================================================================
-- Role Requests Policies
-- ============================================================================

CREATE POLICY role_requests_select_own ON role_requests
    FOR SELECT USING (user_id = current_user_id());

CREATE POLICY role_requests_select_admin ON role_requests
    FOR SELECT USING (has_role(current_user_id(), 'admin'));

CREATE POLICY role_requests_insert_own ON role_requests
    FOR INSERT WITH CHECK (user_id = current_user_id());

CREATE POLICY role_requests_update_admin ON role_requests
    FOR UPDATE USING (has_role(current_user_id(), 'admin'));

-- ============================================================================
-- Tenant Settings Policies
-- ============================================================================

CREATE POLICY tenant_settings_select_authenticated ON tenant_settings
    FOR SELECT USING (current_user_id() IS NOT NULL);

CREATE POLICY tenant_settings_all_admin ON tenant_settings
    FOR ALL USING (
        has_role(current_user_id(), 'tenant_admin') OR 
        has_role(current_user_id(), 'admin')
    );

-- ============================================================================
-- Decisions Policies
-- ============================================================================

CREATE POLICY decisions_select_own ON decisions
    FOR SELECT USING (user_id = current_user_id());

CREATE POLICY decisions_select_privileged ON decisions
    FOR SELECT USING (
        has_role(current_user_id(), 'executive') OR
        has_role(current_user_id(), 'pmo') OR
        has_role(current_user_id(), 'admin')
    );

CREATE POLICY decisions_insert_own ON decisions
    FOR INSERT WITH CHECK (user_id = current_user_id());

CREATE POLICY decisions_update_own ON decisions
    FOR UPDATE USING (user_id = current_user_id());

CREATE POLICY decisions_update_privileged ON decisions
    FOR UPDATE USING (
        has_role(current_user_id(), 'executive') OR
        has_role(current_user_id(), 'pmo') OR
        has_role(current_user_id(), 'admin')
    );

-- ============================================================================
-- Decision Audit Logs Policies
-- ============================================================================

CREATE POLICY decision_audit_logs_select ON decision_audit_logs
    FOR SELECT USING (
        user_id = current_user_id() OR
        has_role(current_user_id(), 'executive') OR
        has_role(current_user_id(), 'pmo') OR
        has_role(current_user_id(), 'admin')
    );

CREATE POLICY decision_audit_logs_insert_own ON decision_audit_logs
    FOR INSERT WITH CHECK (user_id = current_user_id());

-- ============================================================================
-- Documents Policies
-- ============================================================================

CREATE POLICY documents_select_own ON documents
    FOR SELECT USING (user_id = current_user_id());

CREATE POLICY documents_insert_own ON documents
    FOR INSERT WITH CHECK (user_id = current_user_id());

CREATE POLICY documents_update_own ON documents
    FOR UPDATE USING (user_id = current_user_id());

CREATE POLICY documents_delete_own ON documents
    FOR DELETE USING (user_id = current_user_id());

-- ============================================================================
-- Document Templates Policies
-- ============================================================================

CREATE POLICY document_templates_select_own ON document_templates
    FOR SELECT USING (user_id = current_user_id());

CREATE POLICY document_templates_insert_own ON document_templates
    FOR INSERT WITH CHECK (user_id = current_user_id());

CREATE POLICY document_templates_update_own ON document_templates
    FOR UPDATE USING (user_id = current_user_id());

CREATE POLICY document_templates_delete_own ON document_templates
    FOR DELETE USING (user_id = current_user_id());

-- ============================================================================
-- Email Templates Policies
-- ============================================================================

CREATE POLICY email_templates_select_own ON email_templates
    FOR SELECT USING (user_id = current_user_id());

CREATE POLICY email_templates_insert_own ON email_templates
    FOR INSERT WITH CHECK (user_id = current_user_id());

CREATE POLICY email_templates_update_own ON email_templates
    FOR UPDATE USING (user_id = current_user_id());

CREATE POLICY email_templates_delete_own ON email_templates
    FOR DELETE USING (user_id = current_user_id());

-- ============================================================================
-- Company Branding Policies
-- ============================================================================

CREATE POLICY company_branding_select_own ON company_branding
    FOR SELECT USING (user_id = current_user_id());

CREATE POLICY company_branding_insert_own ON company_branding
    FOR INSERT WITH CHECK (user_id = current_user_id());

CREATE POLICY company_branding_update_own ON company_branding
    FOR UPDATE USING (user_id = current_user_id());

CREATE POLICY company_branding_delete_own ON company_branding
    FOR DELETE USING (user_id = current_user_id());

-- ============================================================================
-- User Activities Policies
-- ============================================================================

CREATE POLICY user_activities_select_own ON user_activities
    FOR SELECT USING (user_id = current_user_id());

CREATE POLICY user_activities_select_admin ON user_activities
    FOR SELECT USING (has_role(current_user_id(), 'admin'));

CREATE POLICY user_activities_insert_own ON user_activities
    FOR INSERT WITH CHECK (user_id = current_user_id());

-- ============================================================================
-- AI Output Audit Logs Policies
-- ============================================================================

CREATE POLICY ai_output_audit_logs_select_own ON ai_output_audit_logs
    FOR SELECT USING (user_id = current_user_id());

CREATE POLICY ai_output_audit_logs_select_admin ON ai_output_audit_logs
    FOR SELECT USING (has_role(current_user_id(), 'admin'));

CREATE POLICY ai_output_audit_logs_insert_own ON ai_output_audit_logs
    FOR INSERT WITH CHECK (user_id = current_user_id());
