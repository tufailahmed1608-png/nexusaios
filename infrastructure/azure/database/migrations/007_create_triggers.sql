-- ============================================================================
-- Migration: 007_create_triggers.sql
-- Description: Create database triggers for Nexus OS
-- Target: Azure Database for PostgreSQL Flexible Server
-- ============================================================================

-- ============================================================================
-- Updated At Triggers
-- ============================================================================

-- Profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Role Definitions
DROP TRIGGER IF EXISTS update_role_definitions_updated_at ON role_definitions;
CREATE TRIGGER update_role_definitions_updated_at
    BEFORE UPDATE ON role_definitions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Role Requests
DROP TRIGGER IF EXISTS update_role_requests_updated_at ON role_requests;
CREATE TRIGGER update_role_requests_updated_at
    BEFORE UPDATE ON role_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tenant Settings
DROP TRIGGER IF EXISTS update_tenant_settings_updated_at ON tenant_settings;
CREATE TRIGGER update_tenant_settings_updated_at
    BEFORE UPDATE ON tenant_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Decisions
DROP TRIGGER IF EXISTS update_decisions_updated_at ON decisions;
CREATE TRIGGER update_decisions_updated_at
    BEFORE UPDATE ON decisions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Documents
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Document Templates
DROP TRIGGER IF EXISTS update_document_templates_updated_at ON document_templates;
CREATE TRIGGER update_document_templates_updated_at
    BEFORE UPDATE ON document_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Email Templates
DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Company Branding
DROP TRIGGER IF EXISTS update_company_branding_updated_at ON company_branding;
CREATE TRIGGER update_company_branding_updated_at
    BEFORE UPDATE ON company_branding
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Document Search Vector Trigger
-- ============================================================================
DROP TRIGGER IF EXISTS update_documents_search_vector ON documents;
CREATE TRIGGER update_documents_search_vector
    BEFORE INSERT OR UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_document_search_vector();
