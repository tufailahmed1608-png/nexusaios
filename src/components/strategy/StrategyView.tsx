import { TrendingUp, TrendingDown, Target, DollarSign, BarChart2, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Line,
  Legend,
} from 'recharts';
import { strategicPillars, roiData, budgetForecastData, quarterlyPerformance } from '@/data/mockData';

const StrategyView = () => {
  const totalInvestment = roiData.reduce((sum, item) => sum + item.investment, 0);
  const totalReturns = roiData.reduce((sum, item) => sum + item.returns, 0);
  const averageROI = Math.round(((totalReturns - totalInvestment) / totalInvestment) * 100);

  const pillarsOnTrack = strategicPillars.filter(p => p.status === 'on-track').length;
  const pillarsAtRisk = strategicPillars.filter(p => p.status === 'at-risk').length;
  const pillarsCritical = strategicPillars.filter(p => p.status === 'critical').length;

  return (
    <div className="space-y-6 nexus-fade-in">
      {/* Strategy KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StrategyKPICard
          title="Total Investment"
          value={`$${(totalInvestment / 1000000).toFixed(1)}M`}
          subtitle="Across all projects"
          icon={DollarSign}
          trend="neutral"
        />
        <StrategyKPICard
          title="Total Returns"
          value={`$${(totalReturns / 1000000).toFixed(1)}M`}
          subtitle="Revenue generated"
          icon={TrendingUp}
          trend="up"
          change={12}
        />
        <StrategyKPICard
          title="Average ROI"
          value={`${averageROI}%`}
          subtitle="Portfolio performance"
          icon={BarChart2}
          trend={averageROI > 0 ? 'up' : 'down'}
          change={averageROI}
        />
        <StrategyKPICard
          title="Strategic Pillars"
          value={`${pillarsOnTrack}/${strategicPillars.length}`}
          subtitle={`${pillarsAtRisk} at risk, ${pillarsCritical} critical`}
          icon={Target}
          trend={pillarsCritical > 0 ? 'down' : 'up'}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI by Project */}
        <div className="nexus-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">ROI by Project</h3>
              <p className="text-sm text-muted-foreground">Investment vs Returns analysis</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary" />
                Investment
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[hsl(var(--success))]" />
                Returns
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                <XAxis type="number" tickFormatter={(v) => `$${v / 1000}k`} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" width={100} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${(value / 1000).toFixed(0)}k`, '']}
                />
                <Bar dataKey="investment" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="returns" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Forecast */}
        <div className="nexus-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Budget Forecast</h3>
              <p className="text-sm text-muted-foreground">Planned vs Actual vs Forecast</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={budgetForecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis tickFormatter={(v) => `$${v / 1000}k`} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number | null) => value ? [`$${(value / 1000).toFixed(0)}k`, ''] : ['—', '']}
                />
                <Legend />
                <Bar dataKey="planned" name="Planned" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="actual" name="Actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="forecast" name="Forecast" stroke="hsl(var(--warning))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strategic Pillars */}
      <div className="nexus-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Strategic Pillar Alignment</h3>
            <p className="text-sm text-muted-foreground">Progress towards organizational objectives</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--success))]" />
              On Track
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--warning))]" />
              At Risk
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              Critical
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {strategicPillars.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} />
          ))}
        </div>
      </div>

      {/* Quarterly Performance */}
      <div className="nexus-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Quarterly Performance</h3>
            <p className="text-sm text-muted-foreground">Revenue, Cost & Profit trends</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={quarterlyPerformance}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis tickFormatter={(v) => `$${v / 1000000}M`} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, '']}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--success))" fill="url(#revenueGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="hsl(var(--primary))" fill="url(#profitGradient)" strokeWidth={2} />
              <Line type="monotone" dataKey="cost" name="Cost" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ fill: 'hsl(var(--destructive))' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

interface StrategyKPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
  change?: number;
}

const StrategyKPICard = ({ title, value, subtitle, icon: Icon, trend, change }: StrategyKPICardProps) => {
  return (
    <div className="nexus-card nexus-card-hover">
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-sm font-medium',
            trend === 'up' && 'text-[hsl(var(--success))]',
            trend === 'down' && 'text-destructive',
            trend === 'neutral' && 'text-muted-foreground'
          )}>
            {trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
            {trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
        <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
};

interface PillarCardProps {
  pillar: typeof strategicPillars[0];
}

const PillarCard = ({ pillar }: PillarCardProps) => {
  const progressPercent = Math.round((pillar.progress / pillar.target) * 100);
  
  return (
    <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-border transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground">{pillar.name}</h4>
            <span className={cn(
              'nexus-badge',
              pillar.status === 'on-track' && 'nexus-badge-success',
              pillar.status === 'at-risk' && 'nexus-badge-warning',
              pillar.status === 'critical' && 'nexus-badge-danger'
            )}>
              {pillar.status.replace('-', ' ')}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{pillar.description}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-foreground">{pillar.progress}%</span>
          <p className="text-xs text-muted-foreground">of {pillar.target}% target</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-3">
        {/* Target indicator */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-foreground/40 z-10"
          style={{ left: `${pillar.target}%` }}
        />
        {/* Progress */}
        <div 
          className={cn(
            'h-full rounded-full transition-all duration-500',
            pillar.status === 'on-track' && 'bg-[hsl(var(--success))]',
            pillar.status === 'at-risk' && 'bg-[hsl(var(--warning))]',
            pillar.status === 'critical' && 'bg-destructive'
          )}
          style={{ width: `${pillar.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {pillar.completedInitiatives} of {pillar.initiatives} initiatives completed
        </span>
        <span className={cn(
          'font-medium',
          progressPercent >= 100 && 'text-[hsl(var(--success))]',
          progressPercent >= 80 && progressPercent < 100 && 'text-foreground',
          progressPercent < 80 && 'text-[hsl(var(--warning))]'
        )}>
          {progressPercent}% to target
        </span>
      </div>
    </div>
  );
};

export default StrategyView;
