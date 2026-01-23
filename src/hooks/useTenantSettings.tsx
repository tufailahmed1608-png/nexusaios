import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TenantSetting {
  id: string;
  setting_key: string;
  setting_value: { enabled: boolean };
  description: string;
  category: string;
}

interface TenantSettings {
  smartInboxEnabled: boolean;
  smartInboxAggregateOnly: boolean;
  smartInboxNoHrUsage: boolean;
  riskSignalsEvidenceBased: boolean;
  riskSignalsNoPeopleAnalytics: boolean;
  aiHumanApprovalRequired: boolean;
  pilotModeEnabled: boolean;
}

const defaultSettings: TenantSettings = {
  smartInboxEnabled: true,
  smartInboxAggregateOnly: true,
  smartInboxNoHrUsage: true,
  riskSignalsEvidenceBased: true,
  riskSignalsNoPeopleAnalytics: true,
  aiHumanApprovalRequired: true,
  pilotModeEnabled: false,
};

export function useTenantSettings() {
  const [settings, setSettings] = useState<TenantSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_settings')
        .select('*');

      if (error) throw error;

      if (data) {
        const settingsMap = data.reduce((acc, setting) => {
          const value = setting.setting_value as { enabled?: boolean } | null;
          acc[setting.setting_key] = value?.enabled ?? false;
          return acc;
        }, {} as Record<string, boolean>);

        setSettings({
          smartInboxEnabled: settingsMap['smart_inbox_enabled'] ?? true,
          smartInboxAggregateOnly: settingsMap['smart_inbox_aggregate_only'] ?? true,
          smartInboxNoHrUsage: settingsMap['smart_inbox_no_hr_usage'] ?? true,
          riskSignalsEvidenceBased: settingsMap['risk_signals_evidence_based'] ?? true,
          riskSignalsNoPeopleAnalytics: settingsMap['risk_signals_no_people_analytics'] ?? true,
          aiHumanApprovalRequired: settingsMap['ai_human_approval_required'] ?? true,
          pilotModeEnabled: settingsMap['pilot_mode_enabled'] ?? false,
        });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error fetching tenant settings:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('tenant_settings')
        .update({ 
          setting_value: { enabled },
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key);

      if (error) throw error;

      await fetchSettings();
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error updating tenant setting:', errorMessage);
      setError(errorMessage);
      return false;
    }
  };

  return {
    settings,
    isLoading,
    error,
    updateSetting,
    refetch: fetchSettings,
  };
}
