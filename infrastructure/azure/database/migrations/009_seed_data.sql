-- ============================================================================
-- Migration: 009_seed_data.sql
-- Description: Seed initial data for Nexus OS
-- Target: Azure Database for PostgreSQL Flexible Server
-- ============================================================================

-- ============================================================================
-- Seed Role Definitions
-- ============================================================================

INSERT INTO role_definitions (role, display_name, description, permissions, hierarchy_level)
VALUES
    ('admin', 'Administrator', 'Full system access with all permissions', 
     '["manage_users", "manage_roles", "manage_settings", "view_all_data", "manage_all_data", "manage_branding", "view_analytics", "manage_tenants"]'::jsonb, 100),
    
    ('tenant_admin', 'Tenant Administrator', 'Tenant-level administration access',
     '["manage_tenant_users", "manage_tenant_settings", "view_tenant_data", "manage_branding"]'::jsonb, 90),
    
    ('executive', 'Executive', 'Executive-level access for strategic decisions',
     '["view_all_projects", "approve_decisions", "view_reports", "view_analytics", "manage_stakeholders"]'::jsonb, 80),
    
    ('pmo', 'PMO Manager', 'Project Management Office access',
     '["manage_projects", "view_all_projects", "manage_resources", "view_reports", "approve_decisions"]'::jsonb, 70),
    
    ('project_manager', 'Project Manager', 'Project management access',
     '["manage_own_projects", "manage_tasks", "manage_team", "view_reports"]'::jsonb, 60),
    
    ('stakeholder', 'Stakeholder', 'External stakeholder access',
     '["view_assigned_projects", "view_reports", "submit_feedback"]'::jsonb, 40),
    
    ('team_member', 'Team Member', 'Standard team member access',
     '["view_assigned_tasks", "update_own_tasks", "view_team"]'::jsonb, 30),
    
    ('user', 'User', 'Basic user access',
     '["view_own_data", "update_own_profile"]'::jsonb, 10)
ON CONFLICT (role) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    hierarchy_level = EXCLUDED.hierarchy_level;

-- ============================================================================
-- Seed Default Tenant Settings
-- ============================================================================

INSERT INTO tenant_settings (setting_key, setting_value, category, description)
VALUES
    ('app_name', '"Nexus OS"'::jsonb, 'branding', 'Application display name'),
    ('default_language', '"en"'::jsonb, 'localization', 'Default application language'),
    ('date_format', '"YYYY-MM-DD"'::jsonb, 'localization', 'Default date format'),
    ('timezone', '"Asia/Riyadh"'::jsonb, 'localization', 'Default timezone for Saudi Arabia'),
    ('enable_ai_features', 'true'::jsonb, 'features', 'Enable AI-powered features'),
    ('enable_notifications', 'true'::jsonb, 'features', 'Enable in-app notifications'),
    ('enable_email_notifications', 'true'::jsonb, 'features', 'Enable email notifications'),
    ('session_timeout_minutes', '60'::jsonb, 'security', 'Session timeout in minutes'),
    ('max_file_upload_mb', '50'::jsonb, 'storage', 'Maximum file upload size in MB'),
    ('retention_days', '365'::jsonb, 'storage', 'Data retention period in days')
ON CONFLICT (setting_key) DO NOTHING;
