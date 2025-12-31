import { useDashboardData } from '@/hooks/useSyncedData';
import KPICard from './KPICard';
import PortfolioChart from './PortfolioChart';
import BudgetChart from './BudgetChart';
import ProjectList from './ProjectList';
import VelocityChart from './VelocityChart';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { kpis, hasSyncedData, isLoading } = useDashboardData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="nexus-fade-in">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground">Executive Dashboard</h2>
          {hasSyncedData && (
            <Badge variant="secondary" className="gap-1">
              <RefreshCw className="h-3 w-3" />
              Live Data
            </Badge>
          )}
          {isLoading && (
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <p className="text-muted-foreground">
          {hasSyncedData 
            ? 'Real-time data synced from Microsoft Project' 
            : 'Real-time overview of your project portfolio'}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.id} kpi={kpi} index={index} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioChart />
        <BudgetChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectList />
        <VelocityChart />
      </div>
    </div>
  );
};

export default Dashboard;
