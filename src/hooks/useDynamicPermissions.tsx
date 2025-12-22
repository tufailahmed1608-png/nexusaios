import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppRole, FEATURE_PERMISSIONS } from '@/lib/permissions';

interface DynamicPermissions {
  [role: string]: string[];
}

export const useDynamicPermissions = () => {
  const [permissions, setPermissions] = useState<DynamicPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const { data, error } = await supabase
          .from('role_definitions')
          .select('role, permissions');

        if (error) {
          console.error('Failed to fetch dynamic permissions:', error);
          setPermissions(null);
          return;
        }

        if (data && data.length > 0) {
          const permMap: DynamicPermissions = {};
          data.forEach((roleDef: any) => {
            if (Array.isArray(roleDef.permissions) && roleDef.permissions.length > 0) {
              permMap[roleDef.role] = roleDef.permissions;
            }
          });
          
          // Only set if we actually have custom permissions
          if (Object.keys(permMap).length > 0) {
            setPermissions(permMap);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dynamic permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const hasFeatureAccess = useCallback(
    (userRole: AppRole | null, feature: string): boolean => {
      if (!userRole) return false;
      
      // Admin always has full access
      if (userRole === 'admin') return true;

      // If we have dynamic permissions for this role, use them
      if (permissions && permissions[userRole]) {
        return permissions[userRole].includes(feature);
      }

      // Fall back to hardcoded permissions
      const allowedRoles = FEATURE_PERMISSIONS[feature];
      if (!allowedRoles) return false;
      return allowedRoles.includes(userRole);
    },
    [permissions]
  );

  return {
    hasFeatureAccess,
    loading,
    hasDynamicPermissions: permissions !== null,
  };
};
