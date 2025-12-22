import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Target,
  PieChart,
  Activity,
  Briefcase,
  Calendar
} from 'lucide-react';

interface RoleDashboardPreviewProps {
  role: string;
}

const dashboardPreviews = {
  executive: {
    title: 'Executive Dashboard',
    widgets: [
      { icon: PieChart, label: 'Portfolio Health', value: '87%', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      { icon: TrendingUp, label: 'On Track', value: '12/15', color: 'text-primary', bg: 'bg-primary/10' },
      { icon: AlertTriangle, label: 'At Risk', value: '2', color: 'text-amber-500', bg: 'bg-amber-500/10' },
      { icon: Target, label: 'Strategic Alignment', value: '94%', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    ],
    features: ['AI Executive Summary', 'Strategic KPI Heatmap', 'Risk Concentration View', 'Decision Queue'],
  },
  pmo: {
    title: 'PMO Command Center',
    widgets: [
      { icon: Briefcase, label: 'Active Projects', value: '24', color: 'text-primary', bg: 'bg-primary/10' },
      { icon: Users, label: 'Resource Util.', value: '82%', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      { icon: FileText, label: 'Pending Reports', value: '5', color: 'text-amber-500', bg: 'bg-amber-500/10' },
      { icon: CheckCircle2, label: 'Governance Score', value: 'A+', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    ],
    features: ['Cross-Project Analytics', 'Governance Dashboard', 'Resource Management', 'Report Generation'],
  },
  program_manager: {
    title: 'Program Overview',
    widgets: [
      { icon: Activity, label: 'Program Health', value: '91%', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      { icon: BarChart3, label: 'Dependencies', value: '8 Active', color: 'text-primary', bg: 'bg-primary/10' },
      { icon: Calendar, label: 'Next Milestone', value: '12 days', color: 'text-amber-500', bg: 'bg-amber-500/10' },
      { icon: TrendingUp, label: 'Velocity', value: '+15%', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    ],
    features: ['Dependency Tracker', 'Milestone Timeline', 'Cross-Team Sync', 'Escalation Management'],
  },
  project_manager: {
    title: 'Project Dashboard',
    widgets: [
      { icon: CheckCircle2, label: 'Tasks Done', value: '45/52', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      { icon: Clock, label: 'Sprint Progress', value: '78%', color: 'text-primary', bg: 'bg-primary/10' },
      { icon: Users, label: 'Team Members', value: '8', color: 'text-amber-500', bg: 'bg-amber-500/10' },
      { icon: AlertTriangle, label: 'Open Risks', value: '3', color: 'text-red-500', bg: 'bg-red-500/10' },
    ],
    features: ['Task Board', 'Team Workload', 'Risk Register', 'Meeting Intelligence'],
  },
};

const RoleDashboardPreview = ({ role }: RoleDashboardPreviewProps) => {
  const preview = dashboardPreviews[role as keyof typeof dashboardPreviews] || dashboardPreviews.executive;

  return (
    <div 
      key={role}
      className="relative rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden animate-fade-in"
    >
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <span className="text-6xl font-bold text-foreground/5 rotate-[-15deg] select-none">
          PREVIEW
        </span>
      </div>

      {/* Mock Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400/50" />
          <div className="w-3 h-3 rounded-full bg-amber-400/50" />
          <div className="w-3 h-3 rounded-full bg-emerald-400/50" />
          <span className="ml-3 text-xs font-medium text-muted-foreground">{preview.title}</span>
        </div>
      </div>

      {/* Mock Dashboard Content */}
      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {preview.widgets.map((widget, index) => (
            <div 
              key={index}
              className="p-3 rounded-lg bg-background/50 border border-border/30 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-6 h-6 rounded-md ${widget.bg} flex items-center justify-center`}>
                  <widget.icon className={`w-3 h-3 ${widget.color}`} />
                </div>
                <span className="text-[10px] text-muted-foreground truncate">{widget.label}</span>
              </div>
              <div className={`text-lg font-bold ${widget.color}`}>{widget.value}</div>
            </div>
          ))}
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-1.5">
          {preview.features.map((feature, index) => (
            <span 
              key={index}
              className="px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Mock Chart Area */}
        <div className="h-16 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 flex items-end justify-around px-2 pb-2">
          {[40, 65, 45, 80, 55, 70, 50].map((height, i) => (
            <div 
              key={i} 
              className="w-3 rounded-t bg-primary/30 transition-all duration-500"
              style={{ 
                height: `${height}%`,
                animationDelay: `${i * 50}ms`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleDashboardPreview;