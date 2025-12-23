-- ============================================================================
-- Migration: 005_create_audit_tables.sql
-- Description: Create audit and activity tracking tables
-- Target: Azure Database for PostgreSQL Flexible Server
-- ============================================================================

-- ============================================================================
-- User Activities Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action_type TEXT NOT NULL,
    page_path TEXT,
    action_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_action_type ON user_activities(action_type);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at);
CREATE INDEX idx_user_activities_page_path ON user_activities(page_path);

COMMENT ON TABLE user_activities IS 'User activity tracking and analytics';

-- ============================================================================
-- AI Output Audit Logs Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_output_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    report_type TEXT NOT NULL,
    report_name TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_output_audit_logs_user_id ON ai_output_audit_logs(user_id);
CREATE INDEX idx_ai_output_audit_logs_report_type ON ai_output_audit_logs(report_type);
CREATE INDEX idx_ai_output_audit_logs_created_at ON ai_output_audit_logs(created_at);

COMMENT ON TABLE ai_output_audit_logs IS 'Audit trail for AI-generated outputs';
