import { kpis } from '@/data/mockData';
import KPICard from './KPICard';
import PortfolioChart from './PortfolioChart';
import BudgetChart from './BudgetChart';
import ProjectList from './ProjectList';
import VelocityChart from './VelocityChart';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="nexus-fade-in">
        <h2 className="text-2xl font-bold text-foreground">Executive Dashboard</h2>
        <p className="text-muted-foreground">Real-time overview of your project portfolio</p>
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
