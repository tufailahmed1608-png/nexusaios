import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEnterpriseSignals } from "@/hooks/useEnterpriseSignals";
import { AlertTriangle, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectSignalsBadgeProps {
  projectName: string;
  compact?: boolean;
}

export function ProjectSignalsBadge({ projectName, compact = false }: ProjectSignalsBadgeProps) {
  const { signals } = useEnterpriseSignals();

  const projectSignals = signals.filter(
    s => !s.is_resolved && s.project_name === projectName
  );
  
  const criticalCount = projectSignals.filter(s => s.severity === 'critical').length;
  const highCount = projectSignals.filter(s => s.severity === 'high').length;
  const totalCount = projectSignals.length;

  if (totalCount === 0) return null;

  const hasCritical = criticalCount > 0;
  const hasHigh = highCount > 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={cn(
              "gap-1 cursor-help",
              hasCritical && "border-destructive/50 bg-destructive/10 text-destructive",
              !hasCritical && hasHigh && "border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400",
              !hasCritical && !hasHigh && "border-[hsl(var(--warning))]/50 bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]"
            )}
          >
            {hasCritical ? (
              <AlertTriangle className="h-3 w-3" />
            ) : (
              <Radio className="h-3 w-3" />
            )}
            {compact ? totalCount : `${totalCount} signal${totalCount !== 1 ? 's' : ''}`}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">Active Signals</p>
            <div className="text-xs space-y-0.5">
              {criticalCount > 0 && (
                <p className="text-destructive">{criticalCount} critical</p>
              )}
              {highCount > 0 && (
                <p className="text-orange-600 dark:text-orange-400">{highCount} high priority</p>
              )}
              {projectSignals.filter(s => s.severity === 'medium').length > 0 && (
                <p className="text-[hsl(var(--warning))]">
                  {projectSignals.filter(s => s.severity === 'medium').length} medium
                </p>
              )}
              {projectSignals.filter(s => s.severity === 'low').length > 0 && (
                <p className="text-muted-foreground">
                  {projectSignals.filter(s => s.severity === 'low').length} low
                </p>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
