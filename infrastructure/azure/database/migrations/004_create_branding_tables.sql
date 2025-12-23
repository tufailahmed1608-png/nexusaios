-- ============================================================================
-- Migration: 004_create_branding_tables.sql
-- Description: Create company branding and customization tables
-- Target: Azure Database for PostgreSQL Flexible Server
-- ============================================================================

-- ============================================================================
-- Company Branding Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_branding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    company_name TEXT NOT NULL DEFAULT 'My Company',
    tagline TEXT,
    logo_url TEXT,
    primary_color TEXT NOT NULL DEFAULT '#6366f1',
    secondary_color TEXT NOT NULL DEFAULT '#8b5cf6',
    accent_color TEXT NOT NULL DEFAULT '#06b6d4',
    font_heading TEXT NOT NULL DEFAULT 'Inter',
    font_body TEXT NOT NULL DEFAULT 'Inter',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_company_branding_user_id ON company_branding(user_id);

COMMENT ON TABLE company_branding IS 'Company branding and theming settings';
