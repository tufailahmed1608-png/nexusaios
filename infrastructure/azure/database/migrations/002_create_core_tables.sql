-- ============================================================================
-- Migration: 002_create_core_tables.sql
-- Description: Create core tables for Nexus OS
-- Target: Azure Database for PostgreSQL Flexible Server
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- Profiles Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);

COMMENT ON TABLE profiles IS 'User profile information';

-- ============================================================================
-- User Roles Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

COMMENT ON TABLE user_roles IS 'User role assignments for RBAC';

-- ============================================================================
-- Role Definitions Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS role_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role app_role NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    hierarchy_level INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_role_definitions_role ON role_definitions(role);

COMMENT ON TABLE role_definitions IS 'Role metadata and permissions';

-- ============================================================================
-- Role Requests Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS role_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    requested_role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_role_requests_user_id ON role_requests(user_id);
CREATE INDEX idx_role_requests_status ON role_requests(status);

COMMENT ON TABLE role_requests IS 'User requests for role changes';

-- ============================================================================
-- Tenant Settings Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS tenant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    category TEXT NOT NULL DEFAULT 'general',
    description TEXT,
    updated_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenant_settings_key ON tenant_settings(setting_key);
CREATE INDEX idx_tenant_settings_category ON tenant_settings(category);

COMMENT ON TABLE tenant_settings IS 'Application-wide tenant configuration';
