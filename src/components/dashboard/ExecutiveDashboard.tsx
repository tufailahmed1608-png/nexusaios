import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Users,
  CheckCircle,
  AlertTriangle,
  FileText,
  ArrowRight,
  Shield,
  BarChart3,
  Globe,
  Clock,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Strategic KPIs for executives - high-level, outcome-focused
const strategicKPIs = [
  {
    id: 'portfolio-health',
    title: 'Portfolio Health',
    value: '87%',
    change: +5,
    trend: 'up' as const,
    icon: Shield,
    description: 'Overall portfolio performance',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
  },
  {
    id: 'roi',
    title: 'ROI Achievement',
    value: '124%',
    change: +12,
    trend: 'up' as const,
    icon: TrendingUp,
    description: 'Return on investment',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    id: 'budget-variance',
    title: 'Budget Variance',
    value: '-3.2%',
    change: -1.5,
    trend: 'up' as const,
    icon: DollarSign,
    description: 'Under budget is positive',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
  },
  {
    id: 'strategic-alignment',
    title: 'Strategic Alignment',
    value: '94%',
    change: +3,
    trend: 'up' as const,
    icon: Target,
    description: 'Projects aligned to Vision 2030',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
];

// Mock approved reports for executives
const approvedReports = [
  {
    id: '1',
    name: 'Q4 Portfolio Performance Report',
    type: 'Quarterly Review',
    approvedAt: '2024-12-20T14:30:00Z',
    approvedBy: 'Sarah Mitchell, PMO Director',
    summary: 'All major initiatives on track. Digital transformation at 87% completion.',
  },
  {
    id: '2',
    name: 'Strategic Initiative Update',
    type: 'Strategic Update',
    approvedAt: '2024-12-18T10:00:00Z',
    approvedBy: 'James Wilson, Program Manager',
    summary: 'Cloud migration delivering 34% cost savings ahead of schedule.',
  },
  {
    id: '3',
    name: 'Risk Assessment Summary',
    type: 'Risk Report',
    approvedAt: '2024-12-15T16:45:00Z',
    approvedBy: 'Sarah Mitchell, PMO Director',
    summary: '2 high-priority risks identified. Mitigation plans approved and in progress.',
  },
];

// Strategic decisions pending
const pendingDecisions = [
  {
    id: '1',
    title: 'Phase 2 Budget Approval',
    project: 'Digital Transformation',
    amount: '$2.4M',
    dueDate: '2024-12-28',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Vendor Selection - Cloud Platform',
    project: 'Cloud Migration',
    amount: '$850K',
    dueDate: '2025-01-05',
    priority: 'medium',
  },
];

// Portfolio summary
const portfolioSummary = {
  totalProjects: 12,
  onTrack: 9,
  atRisk: 2,
  critical: 1,
  totalBudget: '$45.2M',
  spent: '$28.7M',
  percentComplete: 63,
};

const ExecutiveDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="nexus-fade-in flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Executive Overview</h2>
          <p className="text-muted-foreground">
            Strategic insights • Last updated {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5 self-start">
          <Globe className="h-3.5 w-3.5" />
          Approved Data Only
        </Badge>
      </div>

      {/* Strategic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {strategicKPIs.map((kpi, index) => (
          <Card 
            key={kpi.id} 
            className="nexus-fade-in hover:shadow-md transition-shadow"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className={cn('p-2 rounded-lg', kpi.bgColor)}>
                  <kpi.icon className={cn('h-5 w-5', kpi.color)} />
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                )}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {kpi.change > 0 ? '+' : ''}{kpi.change}%
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{kpi.title}</p>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Summary */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              Portfolio Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-medium">{portfolioSummary.percentComplete}%</span>
            </div>
            <Progress value={portfolioSummary.percentComplete} className="h-2" />
            
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950">
                <p className="text-2xl font-bold text-emerald-600">{portfolioSummary.onTrack}</p>
                <p className="text-xs text-muted-foreground">On Track</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950">
                <p className="text-2xl font-bold text-amber-600">{portfolioSummary.atRisk}</p>
                <p className="text-xs text-muted-foreground">At Risk</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950">
                <p className="text-2xl font-bold text-red-600">{portfolioSummary.critical}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Budget</span>
                <span className="font-medium">{portfolioSummary.totalBudget}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent to Date</span>
                <span className="font-medium">{portfolioSummary.spent}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approved Reports */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                Approved Reports
              </CardTitle>
              <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950">
                <Globe className="h-3 w-3" />
                Published
              </Badge>
            </div>
            <CardDescription>
              Verified and approved executive summaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px] pr-4">
              <div className="space-y-3">
                {approvedReports.map((report) => (
                  <div 
                    key={report.id}
                    className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-medium text-foreground truncate">
                            {report.name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {report.summary}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(report.approvedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {report.approvedBy}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="shrink-0">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Pending Decisions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Pending Decisions
            </CardTitle>
            <Badge variant="outline" className="gap-1">
              {pendingDecisions.length} awaiting
            </Badge>
          </div>
          <CardDescription>
            Strategic decisions requiring executive approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingDecisions.map((decision) => (
              <div 
                key={decision.id}
                className={cn(
                  'p-4 rounded-lg border-2 transition-colors',
                  decision.priority === 'high' 
                    ? 'border-amber-300 bg-amber-50/50 dark:bg-amber-950/30' 
                    : 'border-border bg-muted/30'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-medium text-foreground">{decision.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{decision.project}</p>
                  </div>
                  <Badge 
                    variant={decision.priority === 'high' ? 'destructive' : 'secondary'}
                    className="shrink-0"
                  >
                    {decision.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      {decision.amount}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Due {new Date(decision.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Trust Indicator */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">AI-Verified Insights</h4>
              <p className="text-sm text-muted-foreground">
                All data shown has been reviewed and approved through the governance workflow.
                Reports undergo Draft → Reviewed → Approved → Published stages before appearing here.
              </p>
            </div>
            <Badge variant="outline" className="gap-1.5 text-primary border-primary/30">
              <Shield className="h-3.5 w-3.5" />
              Trusted
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveDashboard;
