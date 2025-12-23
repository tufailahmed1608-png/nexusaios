-- ============================================================================
-- Nexus OS - Supabase Data Export Script
-- Description: Export data from Supabase for migration to Azure PostgreSQL
-- Usage: Run this script against your Supabase database
-- ============================================================================

-- ============================================================================
-- INSTRUCTIONS:
-- 1. Connect to your Supabase database using psql or any SQL client
-- 2. Run this script to generate CSV exports
-- 3. Transfer the CSV files to your Azure environment
-- 4. Use the import script to load data into Azure PostgreSQL
-- ============================================================================

-- Create export directory (run this from command line, not SQL)
-- mkdir -p /tmp/nexus_export

-- ============================================================================
-- Export Tables
-- ============================================================================

-- Export profiles
\COPY (SELECT id, user_id, display_name, avatar_url, created_at, updated_at FROM public.profiles) TO '/tmp/nexus_export/profiles.csv' WITH CSV HEADER;

-- Export user_roles
\COPY (SELECT id, user_id, role, created_at FROM public.user_roles) TO '/tmp/nexus_export/user_roles.csv' WITH CSV HEADER;

-- Export role_definitions
\COPY (SELECT id, role, display_name, description, permissions, hierarchy_level, created_at, updated_at FROM public.role_definitions) TO '/tmp/nexus_export/role_definitions.csv' WITH CSV HEADER;

-- Export role_requests
\COPY (SELECT id, user_id, requested_role, status, admin_notes, reviewed_by, reviewed_at, created_at, updated_at FROM public.role_requests) TO '/tmp/nexus_export/role_requests.csv' WITH CSV HEADER;

-- Export tenant_settings
\COPY (SELECT id, setting_key, setting_value, category, description, updated_by, created_at, updated_at FROM public.tenant_settings) TO '/tmp/nexus_export/tenant_settings.csv' WITH CSV HEADER;

-- Export decisions
\COPY (SELECT id, user_id, title, description, decision_type, status, priority, project_name, amount, impact, rationale, stakeholders, due_date, decided_at, decided_by, created_at, updated_at FROM public.decisions) TO '/tmp/nexus_export/decisions.csv' WITH CSV HEADER;

-- Export decision_audit_logs
\COPY (SELECT id, decision_id, user_id, action, previous_status, new_status, notes, created_at FROM public.decision_audit_logs) TO '/tmp/nexus_export/decision_audit_logs.csv' WITH CSV HEADER;

-- Export documents
\COPY (SELECT id, user_id, title, content, file_name, file_type, created_at, updated_at FROM public.documents) TO '/tmp/nexus_export/documents.csv' WITH CSV HEADER;

-- Export document_templates
\COPY (SELECT id, user_id, name, type, content, is_default, created_at, updated_at FROM public.document_templates) TO '/tmp/nexus_export/document_templates.csv' WITH CSV HEADER;

-- Export email_templates
\COPY (SELECT id, user_id, name, type, subject, body, is_default, created_at, updated_at FROM public.email_templates) TO '/tmp/nexus_export/email_templates.csv' WITH CSV HEADER;

-- Export company_branding
\COPY (SELECT id, user_id, company_name, tagline, logo_url, primary_color, secondary_color, accent_color, font_heading, font_body, created_at, updated_at FROM public.company_branding) TO '/tmp/nexus_export/company_branding.csv' WITH CSV HEADER;

-- Export user_activities
\COPY (SELECT id, user_id, action_type, page_path, action_details, created_at FROM public.user_activities) TO '/tmp/nexus_export/user_activities.csv' WITH CSV HEADER;

-- Export ai_output_audit_logs
\COPY (SELECT id, user_id, report_type, report_name, previous_status, new_status, notes, created_at FROM public.ai_output_audit_logs) TO '/tmp/nexus_export/ai_output_audit_logs.csv' WITH CSV HEADER;

-- ============================================================================
-- Verify Exports
-- ============================================================================
\! echo "Export complete. Files saved to /tmp/nexus_export/"
\! ls -la /tmp/nexus_export/
