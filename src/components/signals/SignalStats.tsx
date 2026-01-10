import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignalStats as SignalStatsType } from "@/hooks/useEnterpriseSignals";
import { 
  AlertTriangle, 
  MessageSquare, 
  Shield, 
  Activity,
  AlertCircle
} from "lucide-react";

interface SignalStatsProps {
  stats: SignalStatsType | null;
  isLoading?: boolean;
}

export function SignalStats({ stats, isLoading }: SignalStatsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-20" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Signals',
      value: stats.total,
      icon: Activity,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Project',
      value: stats.byCategory.project,
      icon: AlertTriangle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Communication',
      value: stats.byCategory.communication,
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Governance',
      value: stats.byCategory.governance,
      icon: Shield,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Unresolved',
      value: stats.unresolved,
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <div className={`p-1 rounded ${stat.bgColor}`}>
                  <Icon className={`h-3 w-3 ${stat.color}`} />
                </div>
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
