import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ActivityEvent {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  target: string;
  targetType: 'task' | 'project' | 'document' | 'meeting' | 'comment';
  timestamp: string;
}

export const useRealtimeActivity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!user) return;

    const activityChannel = supabase.channel('nexus-activity');

    activityChannel
      .on('broadcast', { event: 'activity' }, ({ payload }) => {
        console.log('Activity received:', payload);
        setActivities((prev) => [payload as ActivityEvent, ...prev].slice(0, 50));
      })
      .subscribe();

    setChannel(activityChannel);

    return () => {
      activityChannel.unsubscribe();
    };
  }, [user]);

  const broadcastActivity = useCallback(
    async (action: string, target: string, targetType: ActivityEvent['targetType']) => {
      if (!channel || !user) return;

      const activity: ActivityEvent = {
        id: crypto.randomUUID(),
        userId: user.id,
        userEmail: user.email || 'Unknown',
        action,
        target,
        targetType,
        timestamp: new Date().toISOString(),
      };

      await channel.send({
        type: 'broadcast',
        event: 'activity',
        payload: activity,
      });

      // Also add to local state
      setActivities((prev) => [activity, ...prev].slice(0, 50));
    },
    [channel, user]
  );

  return { activities, broadcastActivity };
};
