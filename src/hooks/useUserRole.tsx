import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { AppRole, hasMinimumRole, ROLE_HIERARCHY, FEATURE_PERMISSIONS } from '@/lib/permissions';

interface DynamicPermissions {
  [role: string]: string[];
}

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [dynamicPermissions, setDynamicPermissions] = useState<DynamicPermissions | null>(null);

  useEffect(() => {
    const fetchUserRoleAndPermissions = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (roleError) {
          console.error('Failed to fetch user role:', roleError);
          setRole('user');
        } else {
          setRole((roleData?.role as AppRole) || 'user');
        }

        // Fetch dynamic permissions from role_definitions
        const { data: permData, error: permError } = await supabase
          .from('role_definitions')
          .select('role, permissions');

        if (!permError && permData && permData.length > 0) {
          const permMap: DynamicPermissions = {};
          permData.forEach((roleDef: any) => {
            if (Array.isArray(roleDef.permissions) && roleDef.permissions.length > 0) {
              permMap[roleDef.role] = roleDef.permissions;
            }
          });
          
          if (Object.keys(permMap).length > 0) {
            setDynamicPermissions(permMap);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoleAndPermissions();
  }, [user]);

  const canAccess = useCallback(
    (feature: string): boolean => {
      if (!role) return false;
      
      // Admin always has full access
      if (role === 'admin') return true;

      // If we have dynamic permissions for this role, use them
      if (dynamicPermissions && dynamicPermissions[role]) {
        return dynamicPermissions[role].includes(feature);
      }

      // Fall back to hardcoded permissions
      const allowedRoles = FEATURE_PERMISSIONS[feature];
      if (!allowedRoles) return false;
      return allowedRoles.includes(role);
    },
    [role, dynamicPermissions]
  );

  const hasMinRole = useCallback(
    (minimumRole: AppRole): boolean => {
      return hasMinimumRole(role, minimumRole);
    },
    [role]
  );

  const isAdmin = role === 'admin';
  const isPMO = role === 'pmo' || isAdmin;
  const isProgramManager = role === 'program_manager' || isPMO;
  const isSeniorPM = role === 'senior_project_manager' || isProgramManager;
  const isProjectManager = role === 'project_manager' || isSeniorPM;

  return {
    role,
    loading,
    canAccess,
    hasMinRole,
    isAdmin,
    isPMO,
    isProgramManager,
    isSeniorPM,
    isProjectManager,
    hierarchyLevel: role ? ROLE_HIERARCHY[role] : 0,
    hasDynamicPermissions: dynamicPermissions !== null,
  };
};
