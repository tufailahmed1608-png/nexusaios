-- Fix RLS Policies: Require authentication for profiles and role_definitions
-- And restrict projects_sync access to authorized roles

-- ============================================
-- 1. Fix profiles table - require authentication for SELECT
-- ============================================
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Only authenticated users can view profiles
CREATE POLICY "Authenticated users can view profiles"
ON profiles FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Users can only update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. Fix role_definitions table - require authentication
-- ============================================
DROP POLICY IF EXISTS "Anyone can view role definitions" ON role_definitions;
DROP POLICY IF EXISTS "Role definitions are viewable by everyone" ON role_definitions;
DROP POLICY IF EXISTS "Public can view role definitions" ON role_definitions;

-- Only authenticated users can view role definitions
CREATE POLICY "Authenticated users can view role definitions"
ON role_definitions FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Only admins can modify role definitions
DROP POLICY IF EXISTS "Admins can manage role definitions" ON role_definitions;
CREATE POLICY "Admins can insert role definitions"
ON role_definitions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can update role definitions"
ON role_definitions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete role definitions"
ON role_definitions FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- ============================================
-- 3. Restrict projects_sync access to authorized roles only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can view synced projects" ON projects_sync;
DROP POLICY IF EXISTS "Users can view synced projects" ON projects_sync;
DROP POLICY IF EXISTS "All authenticated users can view projects_sync" ON projects_sync;

-- Only program managers, PMO, executives, and admins can view synced project data
CREATE POLICY "Authorized roles can view projects_sync"
ON projects_sync FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('program_manager', 'senior_project_manager', 'pmo', 'executive', 'admin', 'tenant_admin')
  )
);

-- ============================================
-- 4. Restrict tasks_sync access to authorized roles only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can view synced tasks" ON tasks_sync;
DROP POLICY IF EXISTS "Users can view synced tasks" ON tasks_sync;
DROP POLICY IF EXISTS "All authenticated users can view tasks_sync" ON tasks_sync;

-- Only authorized roles can view synced task data
CREATE POLICY "Authorized roles can view tasks_sync"
ON tasks_sync FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'executive', 'admin', 'tenant_admin')
  )
);

-- ============================================
-- 5. Restrict kpis_sync access to authorized roles only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can view synced kpis" ON kpis_sync;
DROP POLICY IF EXISTS "Users can view synced kpis" ON kpis_sync;
DROP POLICY IF EXISTS "All authenticated users can view kpis_sync" ON kpis_sync;

-- Only authorized roles can view synced KPI data
CREATE POLICY "Authorized roles can view kpis_sync"
ON kpis_sync FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'executive', 'admin', 'tenant_admin')
  )
);