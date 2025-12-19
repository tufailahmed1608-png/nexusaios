import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TrackActionOptions {
  actionType: string;
  actionDetails?: Record<string, unknown>;
  pagePath?: string;
}

export const useActivityTracking = () => {
  const { user } = useAuth();
  const location = useLocation();

  const trackAction = useCallback(async ({ actionType, actionDetails = {}, pagePath }: TrackActionOptions) => {
    if (!user) return;

    try {
      await supabase.from('user_activities' as any).insert({
        user_id: user.id,
        action_type: actionType,
        action_details: actionDetails,
        page_path: pagePath || location.pathname,
      } as any);
    } catch (error) {
      console.error('Failed to track activity:', error);
    }
  }, [user, location.pathname]);

  // Track page visits automatically
  useEffect(() => {
    if (user) {
      trackAction({ actionType: 'page_visit', pagePath: location.pathname });
    }
  }, [location.pathname, user, trackAction]);

  return { trackAction };
};

// Standalone function for tracking without hook context
export const trackUserAction = async (
  userId: string,
  actionType: string,
  actionDetails: Record<string, unknown> = {},
  pagePath?: string
) => {
  try {
    await supabase.from('user_activities' as any).insert({
      user_id: userId,
      action_type: actionType,
      action_details: actionDetails,
      page_path: pagePath || window.location.pathname,
    } as any);
  } catch (error) {
    console.error('Failed to track activity:', error);
  }
};
