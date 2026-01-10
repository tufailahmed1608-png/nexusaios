import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEnterpriseSignals, EnterpriseSignal } from "@/hooks/useEnterpriseSignals";
import { 
  AlertTriangle, 
  MessageSquare, 
  Shield,
  Radio,
  ChevronRight,
  CheckCircle,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface SignalWidgetProps {
  projectName?: string;
  maxItems?: number;
  compact?: boolean;
  onViewAll?: () => void;
}

const categoryIcons = {
  project: AlertTriangle,
  communication: MessageSquare,
  governance: Shield,
};

const severityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20',
  high: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  critical: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function SignalWidget({ 
  projectName, 
  maxItems = 5, 
  compact = false,
  onViewAll 
}: SignalWidgetProps) {
  const { signals, stats, isLoading, resolve, isResolving } = useEnterpriseSignals();

  // Filter signals by project if specified, exclude resolved
  const filteredSignals = signals
    .filter(s => !s.is_resolved)
    .filter(s => !projectName || s.project_name === projectName)
    .slice(0, maxItems);

  const unresolvedCount = projectName 
    ? signals.filter(s => !s.is_resolved && s.project_name === projectName).length
    : stats.unresolved;

  const criticalCount = projectName
    ? signals.filter(s => s.severity === 'critical' && !s.is_resolved && s.project_name === projectName).length
    : stats.bySeverity.critical;

  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", compact && "border-0 shadow-none")}>
        <CardHeader className={cn(compact && "pb-2")}>
          <div className="h-5 bg-muted rounded w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(compact && "border-0 shadow-none bg-transparent")}>
      <CardHeader className={cn("flex flex-row items-center justify-between", compact && "pb-2 px-0")}>
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">
            {projectName ? 'Project Signals' : 'Active Signals'}
          </CardTitle>
          {unresolvedCount > 0 && (
            <Badge variant="secondary" className="gap-1">
              {unresolvedCount}
            </Badge>
          )}
          {criticalCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {criticalCount} Critical
            </Badge>
          )}
        </div>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll} className="gap-1">
            View All
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className={cn(compact && "px-0")}>
        {filteredSignals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Zap className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No active signals</p>
          </div>
        ) : (
          <ScrollArea className={cn(compact ? "h-auto" : "h-[280px]")}>
            <div className="space-y-2">
              {filteredSignals.map((signal) => (
                <SignalItem 
                  key={signal.id} 
                  signal={signal} 
                  compact={compact}
                  onResolve={() => resolve({ id: signal.id, resolved_by: 'Current User' })}
                  isResolving={isResolving}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

interface SignalItemProps {
  signal: EnterpriseSignal;
  compact?: boolean;
  onResolve: () => void;
  isResolving: boolean;
}

function SignalItem({ signal, compact, onResolve, isResolving }: SignalItemProps) {
  const CategoryIcon = categoryIcons[signal.signal_category];
  
  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-secondary/30 transition-colors group",
      signal.severity === 'critical' && "border-destructive/30 bg-destructive/5"
    )}>
      <div className={cn(
        "p-1.5 rounded-md",
        signal.signal_category === 'project' && 'bg-[hsl(var(--warning))]/10',
        signal.signal_category === 'communication' && 'bg-primary/10',
        signal.signal_category === 'governance' && 'bg-purple-500/10'
      )}>
        <CategoryIcon className={cn(
          "h-4 w-4",
          signal.signal_category === 'project' && 'text-[hsl(var(--warning))]',
          signal.signal_category === 'communication' && 'text-primary',
          signal.signal_category === 'governance' && 'text-purple-500'
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-sm text-foreground truncate">{signal.title}</span>
          <Badge 
            variant="outline" 
            className={cn("text-[10px] px-1.5 py-0", severityColors[signal.severity])}
          >
            {signal.severity}
          </Badge>
        </div>
        {!compact && signal.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
            {signal.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {signal.project_name && (
            <>
              <span>{signal.project_name}</span>
              <span>•</span>
            </>
          )}
          <span>{formatDistanceToNow(new Date(signal.created_at), { addSuffix: true })}</span>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onResolve();
        }}
        disabled={isResolving}
      >
        <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />
      </Button>
    </div>
  );
}
