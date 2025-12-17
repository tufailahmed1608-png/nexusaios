import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Folder, CheckCircle, Zap, DollarSign } from 'lucide-react';
import type { KPI } from '@/data/mockData';

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

const KPICard = ({ kpi, index }: KPICardProps) => {
  const Icon = iconMap[kpi.icon] || Folder;
  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      className="nexus-kpi-card nexus-card-hover nexus-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
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
