import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface LogAuditParams {
  reportType: string;
  reportName: string;
  previousStatus: string | null;
  newStatus: string;
  notes?: string;
}

export const useAuditLog = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const logStatusChange = async ({
    reportType,
    reportName,
    previousStatus,
    newStatus,
    notes,
  }: LogAuditParams) => {
    if (!user) {
      console.warn('Cannot log audit: no user logged in');
      return false;
    }

    try {
      const { error } = await supabase
        .from('ai_output_audit_logs')
        .insert({
          user_id: user.id,
          report_type: reportType,
          report_name: reportName,
          previous_status: previousStatus,
          new_status: newStatus,
          notes,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to log audit:', error);
      toast({
        title: 'Audit Log Failed',
        description: 'Could not record status change',
        variant: 'destructive',
      });
      return false;
    }
  };

  return { logStatusChange };
};
