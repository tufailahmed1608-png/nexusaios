-- ============================================================================
-- AWS Cognito User Context Functions
-- Replaces Supabase auth.uid() with session-based user context
-- ============================================================================

-- Create app schema for application-specific functions
CREATE SCHEMA IF NOT EXISTS app;

-- Function to get current user ID from session variable
-- This is set by Lambda functions after validating Cognito JWT
CREATE OR REPLACE FUNCTION app.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid
$$;

-- Function to check if current user has a specific role
-- Mirrors Supabase has_role() function
CREATE OR REPLACE FUNCTION app.has_role(_role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = app.current_user_id()
      AND role::text = _role
  )
$$;

-- Overload for app_role enum type
CREATE OR REPLACE FUNCTION app.has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = app.current_user_id()
      AND role = _role
  )
$$;

-- Function to check if a specific user has a role
CREATE OR REPLACE FUNCTION app.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Grant execute permissions
GRANT USAGE ON SCHEMA app TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.current_user_id() TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.has_role(text) TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.has_role(app_role) TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.has_role(uuid, app_role) TO PUBLIC;

-- ============================================================================
-- Migration Notes for RLS Policies
-- ============================================================================
-- When creating RLS policies, replace:
--   auth.uid() -> app.current_user_id()
--   has_role(auth.uid(), 'admin') -> app.has_role('admin')
--
-- Example Lambda code to set user context:
--   const { Pool } = require('pg');
--   const pool = new Pool();
--   
--   exports.handler = async (event) => {
--     const userId = event.requestContext.authorizer.claims.sub;
--     const client = await pool.connect();
--     try {
--       await client.query(`SET app.current_user_id = '${userId}'`);
--       // Now all queries will use this user context for RLS
--       const result = await client.query('SELECT * FROM my_table');
--       return { statusCode: 200, body: JSON.stringify(result.rows) };
--     } finally {
--       client.release();
--     }
--   };
-- ============================================================================
