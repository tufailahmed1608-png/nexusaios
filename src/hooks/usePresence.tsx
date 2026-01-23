import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface PresenceUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  onlineAt: string;
  currentView?: string;
  status: 'online' | 'away' | 'busy';
}

export const usePresence = (currentView?: string) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const trackPresence = useCallback(async (ch: RealtimeChannel, view?: string) => {
    if (!user) return;

    const presenceData: PresenceUser = {
      id: user.id,
      email: user.email || 'Unknown',
      onlineAt: new Date().toISOString(),
      currentView: view || 'dashboard',
      status: 'online',
    };

    await ch.track(presenceData);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const presenceChannel = supabase.channel('nexus-presence', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users: PresenceUser[] = [];
        
        Object.values(state).forEach((presences) => {
          (presences as unknown as PresenceUser[]).forEach((presence) => {
            if (presence.id !== user.id) {
              users.push(presence);
            }
          });
        });
        
        setOnlineUsers(users);
        console.log('Presence sync:', users.length, 'users online');
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await trackPresence(presenceChannel, currentView);
        }
      });

    setChannel(presenceChannel);

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [user, trackPresence]);

  // Update presence when view changes
  useEffect(() => {
    if (channel && currentView) {
      trackPresence(channel, currentView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, trackPresence]);

  const updateStatus = async (status: 'online' | 'away' | 'busy') => {
    if (!channel || !user) return;

    const presenceData: PresenceUser = {
      id: user.id,
      email: user.email || 'Unknown',
      onlineAt: new Date().toISOString(),
      currentView: currentView || 'dashboard',
      status,
    };

    await channel.track(presenceData);
  };

  return { onlineUsers, updateStatus };
};
