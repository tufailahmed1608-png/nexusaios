-- ============================================================================
-- Migration: 003_create_business_tables.sql
-- Description: Create business domain tables for Nexus OS
-- Target: Azure Database for PostgreSQL Flexible Server
-- ============================================================================

-- ============================================================================
-- Decisions Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    decision_type TEXT NOT NULL DEFAULT 'strategic',
    status TEXT NOT NULL DEFAULT 'pending',
    priority TEXT NOT NULL DEFAULT 'medium',
    project_name TEXT,
    amount TEXT,
    impact TEXT,
    rationale TEXT,
    stakeholders TEXT[],
    due_date TIMESTAMPTZ,
    decided_at TIMESTAMPTZ,
    decided_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_decisions_user_id ON decisions(user_id);
CREATE INDEX idx_decisions_status ON decisions(status);
CREATE INDEX idx_decisions_priority ON decisions(priority);
CREATE INDEX idx_decisions_decision_type ON decisions(decision_type);
CREATE INDEX idx_decisions_due_date ON decisions(due_date);

COMMENT ON TABLE decisions IS 'Strategic and operational decisions';

-- ============================================================================
-- Decision Audit Logs Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS decision_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    action TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_decision_audit_logs_decision_id ON decision_audit_logs(decision_id);
CREATE INDEX idx_decision_audit_logs_user_id ON decision_audit_logs(user_id);
CREATE INDEX idx_decision_audit_logs_created_at ON decision_audit_logs(created_at);

COMMENT ON TABLE decision_audit_logs IS 'Audit trail for decision changes';

-- ============================================================================
-- Documents Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    file_name TEXT,
    file_type TEXT,
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_search_vector ON documents USING GIN(search_vector);
CREATE INDEX idx_documents_created_at ON documents(created_at);

COMMENT ON TABLE documents IS 'User documents and knowledge base items';

-- ============================================================================
-- Document Templates Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_document_templates_user_id ON document_templates(user_id);
CREATE INDEX idx_document_templates_type ON document_templates(type);

COMMENT ON TABLE document_templates IS 'Reusable document templates';

-- ============================================================================
-- Email Templates Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_templates_user_id ON email_templates(user_id);
CREATE INDEX idx_email_templates_type ON email_templates(type);

COMMENT ON TABLE email_templates IS 'Email notification templates';
