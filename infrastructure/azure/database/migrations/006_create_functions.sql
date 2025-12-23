-- ============================================================================
-- Migration: 006_create_functions.sql
-- Description: Create database functions for Nexus OS
-- Target: Azure Database for PostgreSQL Flexible Server
-- ============================================================================

-- ============================================================================
-- Function: has_role
-- Description: Check if a user has a specific role
-- ============================================================================
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

COMMENT ON FUNCTION has_role IS 'Check if a user has a specific role';

-- ============================================================================
-- Function: get_user_roles
-- Description: Get all roles for a user
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_roles(_user_id UUID)
RETURNS TABLE(role app_role)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT ur.role
    FROM user_roles ur
    WHERE ur.user_id = _user_id
$$;

COMMENT ON FUNCTION get_user_roles IS 'Get all roles assigned to a user';

-- ============================================================================
-- Function: update_updated_at_column
-- Description: Automatically update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION update_updated_at_column IS 'Trigger function to auto-update updated_at';

-- ============================================================================
-- Function: update_document_search_vector
-- Description: Update full-text search vector for documents
-- ============================================================================
CREATE OR REPLACE FUNCTION update_document_search_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''));
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION update_document_search_vector IS 'Trigger function to update document search vector';

-- ============================================================================
-- Function: assign_role
-- Description: Assign a role to a user (admin only)
-- ============================================================================
CREATE OR REPLACE FUNCTION assign_role(
    _admin_user_id UUID,
    _target_user_id UUID,
    _role app_role
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the calling user is an admin
    IF NOT has_role(_admin_user_id, 'admin') THEN
        RAISE EXCEPTION 'Only administrators can assign roles';
    END IF;
    
    -- Insert the role (ignore if already exists)
    INSERT INTO user_roles (user_id, role)
    VALUES (_target_user_id, _role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION assign_role IS 'Assign a role to a user (admin only)';

-- ============================================================================
-- Function: revoke_role
-- Description: Revoke a role from a user (admin only)
-- ============================================================================
CREATE OR REPLACE FUNCTION revoke_role(
    _admin_user_id UUID,
    _target_user_id UUID,
    _role app_role
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the calling user is an admin
    IF NOT has_role(_admin_user_id, 'admin') THEN
        RAISE EXCEPTION 'Only administrators can revoke roles';
    END IF;
    
    -- Delete the role
    DELETE FROM user_roles
    WHERE user_id = _target_user_id AND role = _role;
    
    RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION revoke_role IS 'Revoke a role from a user (admin only)';

-- ============================================================================
-- Function: search_documents
-- Description: Full-text search for documents
-- ============================================================================
CREATE OR REPLACE FUNCTION search_documents(
    _user_id UUID,
    _query TEXT,
    _limit INTEGER DEFAULT 10
)
RETURNS TABLE(
    id UUID,
    title TEXT,
    content TEXT,
    file_name TEXT,
    rank REAL
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        d.id,
        d.title,
        d.content,
        d.file_name,
        ts_rank(d.search_vector, plainto_tsquery('english', _query)) as rank
    FROM documents d
    WHERE d.user_id = _user_id
      AND d.search_vector @@ plainto_tsquery('english', _query)
    ORDER BY rank DESC
    LIMIT _limit
$$;

COMMENT ON FUNCTION search_documents IS 'Full-text search for user documents';
