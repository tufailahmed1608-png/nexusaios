import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  MessageSquare, 
  Shield, 
  CheckCircle2, 
  Clock,
  Building2
} from "lucide-react";
import { EnterpriseSignal } from "@/hooks/useEnterpriseSignals";
import { formatDistanceToNow } from "date-fns";

interface SignalCardProps {
  signal: EnterpriseSignal;
  onResolve?: (id: string) => void;
  isResolving?: boolean;
}

const categoryIcons = {
  project: AlertTriangle,
  communication: MessageSquare,
  governance: Shield,
};

const categoryColors = {
  project: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  communication: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  governance: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
};

const severityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  critical: 'bg-destructive/10 text-destructive border-destructive/20',
};

const typeLabels: Record<string, string> = {
  status_slip: 'Status Slip',
  dependency_delay: 'Dependency Delay',
  budget_drift: 'Budget Drift',
  risk_surfaced: 'Risk Surfaced',
  resource_conflict: 'Resource Conflict',
  escalation_email: 'Escalation',
  late_approval: 'Late Approval',
  executive_nudge: 'Executive Nudge',
  vendor_pressure: 'Vendor Pressure',
  policy_violation: 'Policy Violation',
  missing_approval: 'Missing Approval',
  sla_breach: 'SLA Breach',
  audit_flag: 'Audit Flag',
};

export function SignalCard({ signal, onResolve, isResolving }: SignalCardProps) {
  const CategoryIcon = categoryIcons[signal.signal_category];
  
  return (
    <Card className={`transition-all hover:shadow-md ${signal.is_resolved ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${categoryColors[signal.signal_category]}`}>
              <CategoryIcon className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-sm font-medium leading-tight">
                {signal.title}
              </CardTitle>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs shrink-0 ${severityColors[signal.severity]}`}
          >
            {signal.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {signal.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {signal.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {typeLabels[signal.signal_type] || signal.signal_type}
          </Badge>
          {signal.project_name && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {signal.project_name}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(signal.created_at), { addSuffix: true })}
          </div>
          
          {signal.is_resolved ? (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              Resolved
            </div>
          ) : onResolve && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onResolve(signal.id)}
              disabled={isResolving}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Resolve
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
