-- ============================================================================
-- Migration: 001_create_enums.sql
-- Description: Create custom enum types for Nexus OS
-- Target: Azure Database for PostgreSQL Flexible Server
-- ============================================================================

-- Create application role enum
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM (
        'admin',
        'user',
        'executive',
        'pmo',
        'project_manager',
        'team_member',
        'stakeholder',
        'tenant_admin'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TYPE app_role IS 'Application roles for role-based access control';
