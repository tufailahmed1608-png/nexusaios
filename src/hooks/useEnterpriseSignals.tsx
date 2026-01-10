import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export type SignalCategory = 'project' | 'communication' | 'governance';
export type SignalSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface EnterpriseSignal {
  id: string;
  signal_category: SignalCategory;
  signal_type: string;
  severity: SignalSeverity;
  title: string;
  description: string | null;
  source: string;
  project_name: string | null;
  stakeholder: string | null;
  metadata: Record<string, unknown>;
  is_resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SignalStats {
  total: number;
  byCategory: {
    project: number;
    communication: number;
    governance: number;
  };
  bySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  unresolved: number;
}

export function useEnterpriseSignals() {
  const queryClient = useQueryClient();

  // Fetch all signals
  const signalsQuery = useQuery({
    queryKey: ['enterprise-signals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_signals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EnterpriseSignal[];
    },
  });

  // Calculate stats from signals
  const stats: SignalStats | null = signalsQuery.data ? {
    total: signalsQuery.data.length,
    byCategory: {
      project: signalsQuery.data.filter(s => s.signal_category === 'project').length,
      communication: signalsQuery.data.filter(s => s.signal_category === 'communication').length,
      governance: signalsQuery.data.filter(s => s.signal_category === 'governance').length,
    },
    bySeverity: {
      low: signalsQuery.data.filter(s => s.severity === 'low').length,
      medium: signalsQuery.data.filter(s => s.severity === 'medium').length,
      high: signalsQuery.data.filter(s => s.severity === 'high').length,
      critical: signalsQuery.data.filter(s => s.severity === 'critical').length,
    },
    unresolved: signalsQuery.data.filter(s => !s.is_resolved).length,
  } : null;

  // Generate signals mutation
  const generateMutation = useMutation({
    mutationFn: async ({ count = 5, category }: { count?: number; category?: SignalCategory }) => {
      const { data, error } = await supabase.functions.invoke('generate-signals', {
        body: { action: 'generate', count, category },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprise-signals'] });
    },
  });

  // Clear signals mutation
  const clearMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-signals', {
        body: { action: 'clear' },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprise-signals'] });
    },
  });

  // Resolve signal mutation
  const resolveMutation = useMutation({
    mutationFn: async ({ id, resolved_by }: { id: string; resolved_by: string }) => {
      const { data, error } = await supabase
        .from('enterprise_signals')
        .update({ 
          is_resolved: true, 
          resolved_at: new Date().toISOString(),
          resolved_by 
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprise-signals'] });
    },
  });

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('enterprise-signals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'enterprise_signals',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['enterprise-signals'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    signals: signalsQuery.data || [],
    stats,
    isLoading: signalsQuery.isLoading,
    error: signalsQuery.error,
    generate: generateMutation.mutate,
    isGenerating: generateMutation.isPending,
    clear: clearMutation.mutate,
    isClearing: clearMutation.isPending,
    resolve: resolveMutation.mutate,
    isResolving: resolveMutation.isPending,
    refetch: signalsQuery.refetch,
  };
}
