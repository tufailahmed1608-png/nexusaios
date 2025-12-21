import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { AppRole, hasFeatureAccess, hasMinimumRole, ROLE_HIERARCHY } from '@/lib/permissions';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Failed to fetch user role:', error);
          setRole('user'); // Default to basic user
        } else {
          setRole((data?.role as AppRole) || 'user');
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const canAccess = useCallback(
    (feature: string): boolean => {
      return hasFeatureAccess(role, feature);
    },
    [role]
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
  };
};
