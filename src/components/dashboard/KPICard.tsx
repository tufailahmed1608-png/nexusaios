import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Folder, CheckCircle, Zap, DollarSign } from 'lucide-react';
import type { KPI } from '@/data/mockData';
import { WhyAmISeeingThis, createRoleBasedReason, createPersonalizationReason } from '@/components/ai/WhyAmISeeingThis';
import { useUserRole } from '@/hooks/useUserRole';

interface KPICardProps {
  kpi: KPI;
  index: number;
}

const iconMap: Record<string, React.ElementType> = {
  folder: Folder,
  'check-circle': CheckCircle,
  zap: Zap,
  'dollar-sign': DollarSign,
};

const getKpiReasons = (kpiTitle: string, role: string) => {
  const reasons = [];
  
  // Add role-based reason
  if (role) {
    reasons.push(createRoleBasedReason(role as any, 'dashboard KPIs'));
  }
  
  // Add personalization reasons based on KPI type
  if (kpiTitle.toLowerCase().includes('project')) {
    reasons.push(createPersonalizationReason('projects you manage or participate in'));
  } else if (kpiTitle.toLowerCase().includes('task')) {
    reasons.push(createPersonalizationReason('tasks assigned to you and your team'));
  } else if (kpiTitle.toLowerCase().includes('budget') || kpiTitle.toLowerCase().includes('spent')) {
    reasons.push(createPersonalizationReason('your portfolio budget allocation'));
  } else if (kpiTitle.toLowerCase().includes('velocity') || kpiTitle.toLowerCase().includes('efficiency')) {
    reasons.push(createPersonalizationReason('your team\'s recent performance data'));
  } else {
    reasons.push(createPersonalizationReason('your activity and project involvement'));
  }
  
  return reasons;
};

const KPICard = ({ kpi, index }: KPICardProps) => {
  const { role } = useUserRole();
  const Icon = iconMap[kpi.icon] || Folder;
  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      className="masira-kpi-card masira-card-hover masira-slide-up relative group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Why am I seeing this? tooltip */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <WhyAmISeeingThis 
          reasons={getKpiReasons(kpi.title, role || 'user')} 
          itemType="metric"
          size="sm"
        />
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            kpi.trend === 'up' && 'bg-success/10 text-success',
            kpi.trend === 'down' && 'bg-destructive/10 text-destructive',
            kpi.trend === 'stable' && 'bg-muted text-muted-foreground'
          )}
        >
          <TrendIcon className="w-3 h-3" />
          <span>{Math.abs(kpi.change)}%</span>
        </div>
      </div>

      <div>
        <p className="text-xs md:text-sm text-muted-foreground mb-1">{kpi.title}</p>
        <p className="text-2xl md:text-3xl font-bold text-foreground">{kpi.value}</p>
      </div>
    </div>
  );
};

export default KPICard;
