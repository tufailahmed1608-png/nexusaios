import { useDashboardData } from '@/hooks/useSyncedData';
import KPICard from './KPICard';
import PortfolioChart from './PortfolioChart';
import BudgetChart from './BudgetChart';
import ProjectList from './ProjectList';
import VelocityChart from './VelocityChart';
import { SignalWidget } from '@/components/signals/SignalWidget';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, FileSpreadsheet } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DashboardProps {
  onNavigateToSignals?: () => void;
}

const Dashboard = ({ onNavigateToSignals }: DashboardProps) => {
  const queryClient = useQueryClient();
  const { 
    kpis, 
    hasSyncedData, 
    isLoading,
    syncedProjectsCount,
    syncedKPIsCount,
    syncedTasksCount
  } = useDashboardData();

  const handleRefresh = async () => {
    toast.info('Refreshing dashboard data...');
    await queryClient.invalidateQueries({ queryKey: ['synced-projects'] });
    await queryClient.invalidateQueries({ queryKey: ['synced-kpis'] });
    await queryClient.invalidateQueries({ queryKey: ['synced-tasks'] });
    toast.success('Dashboard refreshed');
  };

  const totalSyncedRecords = syncedProjectsCount + syncedKPIsCount + syncedTasksCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="masira-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Executive Dashboard</h2>
            {hasSyncedData && (
              <Badge variant="secondary" className="gap-1">
                <Database className="h-3 w-3" />
                Live Data
              </Badge>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <div className="flex items-center gap-4 mt-1">
          <p className="text-muted-foreground">
            {hasSyncedData 
              ? 'Real-time data synced from imported files' 
              : 'Real-time overview of your project portfolio'}
          </p>
          {hasSyncedData && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" />
              <span>{syncedProjectsCount} projects</span>
              <span>•</span>
              <span>{syncedTasksCount} tasks</span>
              <span>•</span>
              <span>{syncedKPIsCount} KPIs</span>
            </div>
          )}
        </div>
      </div>

      {/* Synced Data Summary Banner */}
      {hasSyncedData && totalSyncedRecords > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {totalSyncedRecords} records imported from files
              </p>
              <p className="text-sm text-muted-foreground">
                Your dashboard is displaying live data from imported spreadsheets
              </p>
            </div>
          </div>
        </div>
      )}

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProjectList />
        <VelocityChart />
        <SignalWidget onViewAll={onNavigateToSignals} />
      </div>
    </div>
  );
};

export default Dashboard;
