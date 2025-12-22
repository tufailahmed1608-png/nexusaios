import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  FileEdit, 
  Eye, 
  CheckCircle, 
  Globe, 
  ArrowRight,
  ClipboardList,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  report_type: string;
  report_name: string;
  previous_status: string | null;
  new_status: string;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = {
  draft: {
    label: 'Draft',
    icon: FileEdit,
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
  },
  reviewed: {
    label: 'Reviewed',
    icon: Eye,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
  },
  published: {
    label: 'Published',
    icon: Globe,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
};

const AuditLogPanel = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('ai_output_audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setLogs(data || []);
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status];
    if (!config) return <Badge variant="outline">{status}</Badge>;
    
    const Icon = config.icon;
    return (
      <Badge 
        variant="outline" 
        className={cn('gap-1 font-medium', config.color, config.bgColor)}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No Audit Logs Yet</h3>
          <p className="text-muted-foreground">
            Status changes will be tracked here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Audit Log
        </CardTitle>
        <CardDescription>
          Track all status changes for AI-generated outputs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-medium text-foreground truncate">
                      {log.report_name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {log.report_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {log.previous_status ? (
                      <>
                        {getStatusBadge(log.previous_status)}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground mr-1">Created as</span>
                    )}
                    {getStatusBadge(log.new_status)}
                  </div>
                  {log.notes && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      "{log.notes}"
                    </p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(log.created_at), 'MMM d, h:mm a')}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AuditLogPanel;
