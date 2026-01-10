import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  FolderKanban,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Radio,
} from 'lucide-react';
import { projects, Project, Milestone } from '@/data/mockData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProjectSignalsBadge } from '@/components/signals/ProjectSignalsBadge';
import { useEnterpriseSignals } from '@/hooks/useEnterpriseSignals';

// Import project team member avatars
import alexKimAvatar from '@/assets/inbox/alex-kim.png';
import michaelTorresAvatar from '@/assets/inbox/michael-torres.png';
import jordanLeeAvatar from '@/assets/projects/jordan-lee.png';
import sarahChenAvatar from '@/assets/inbox/sarah-chen-email.png';
import emilyWatsonAvatar from '@/assets/inbox/emily-watson.png';
import chrisParkAvatar from '@/assets/projects/chris-park.png';
import danaSmithAvatar from '@/assets/projects/dana-smith.png';
import lisaWangAvatar from '@/assets/projects/lisa-wang.png';

// Avatar mapping for team members
const teamAvatars: Record<string, string> = {
  'Alex Kim': alexKimAvatar,
  'Michael Torres': michaelTorresAvatar,
  'Jordan Lee': jordanLeeAvatar,
  'Sarah Chen': sarahChenAvatar,
  'Emily Watson': emilyWatsonAvatar,
  'Chris Park': chrisParkAvatar,
  'Dana Smith': danaSmithAvatar,
  'Lisa Wang': lisaWangAvatar,
};

type ViewMode = 'cards' | 'gantt';

const ProjectsView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);

  return (
    <div className="space-y-6 masira-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Manage and track all active projects</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              viewMode === 'cards'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            )}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('gantt')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              viewMode === 'gantt'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            )}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={FolderKanban}
          label="Total Projects"
          value={projects.length.toString()}
          subtitle={`${projects.filter(p => p.health === 'on-track').length} on track`}
        />
        <StatCard
          icon={DollarSign}
          label="Total Budget"
          value={`$${(totalBudget / 1000000).toFixed(1)}M`}
          subtitle={`$${(totalSpent / 1000000).toFixed(1)}M spent`}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Progress"
          value={`${avgProgress}%`}
          subtitle="Across all projects"
        />
        <StatCard
          icon={Users}
          label="Team Members"
          value={new Set(projects.flatMap(p => p.team.map(t => t.id))).size.toString()}
          subtitle="Assigned to projects"
        />
      </div>

      {/* Content */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={() => setSelectedProject(project)}
            />
          ))}
        </div>
      ) : (
        <GanttChart projects={projects} />
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle: string;
}

const StatCard = ({ icon: Icon, label, value, subtitle }: StatCardProps) => (
  <div className="masira-card">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xs text-muted-foreground/70">{subtitle}</p>
      </div>
    </div>
  </div>
);

interface ProjectCardProps {
  project: Project;
  onSelect: () => void;
}

const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  const budgetPercent = Math.round((project.spent / project.budget) * 100);
  const isOverBudget = budgetPercent > 90;

  return (
    <div
      className="masira-card masira-card-hover cursor-pointer"
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-foreground">{project.name}</h3>
            <span className={cn(
              'masira-badge',
              project.health === 'on-track' && 'masira-badge-success',
              project.health === 'at-risk' && 'masira-badge-warning',
              project.health === 'critical' && 'masira-badge-danger'
            )}>
              {project.health.replace('-', ' ')}
            </span>
            <ProjectSignalsBadge projectName={project.name} compact />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
        </div>
        <button className="p-1 rounded hover:bg-secondary" onClick={e => e.stopPropagation()}>
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{project.progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              project.health === 'on-track' && 'bg-[hsl(var(--success))]',
              project.health === 'at-risk' && 'bg-[hsl(var(--warning))]',
              project.health === 'critical' && 'bg-destructive'
            )}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Budget */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Budget</span>
          <span className={cn('font-medium', isOverBudget ? 'text-destructive' : 'text-foreground')}>
            ${(project.spent / 1000).toFixed(0)}k / ${(project.budget / 1000).toFixed(0)}k
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              isOverBudget ? 'bg-destructive' : 'bg-primary'
            )}
            style={{ width: `${Math.min(budgetPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Team */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.team.slice(0, 4).map(member => (
            <Avatar
              key={member.id}
              className="w-8 h-8 border-2 border-card"
              title={`${member.name} (${member.allocation}%)`}
            >
              <AvatarImage src={teamAvatars[member.name]} alt={member.name} />
              <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
                {member.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ))}
          {project.team.length > 4 && (
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-foreground border-2 border-card">
              +{project.team.length - 4}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Milestones Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-[hsl(var(--success))]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {project.milestones.filter(m => m.status === 'completed').length} done
          </span>
          <span className="flex items-center gap-1 text-primary">
            <Clock className="w-3.5 h-3.5" />
            {project.milestones.filter(m => m.status === 'in-progress').length} in progress
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Circle className="w-3.5 h-3.5" />
            {project.milestones.filter(m => m.status === 'upcoming').length} upcoming
          </span>
          {project.milestones.filter(m => m.status === 'delayed').length > 0 && (
            <span className="flex items-center gap-1 text-destructive">
              <AlertTriangle className="w-3.5 h-3.5" />
              {project.milestones.filter(m => m.status === 'delayed').length} delayed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface GanttChartProps {
  projects: Project[];
}

const GanttChart = ({ projects }: GanttChartProps) => {
  // Calculate date range
  const allDates = projects.flatMap(p => [
    new Date(p.startDate),
    new Date(p.endDate),
    ...p.milestones.flatMap(m => [new Date(m.startDate), new Date(m.endDate)])
  ]);
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  
  // Generate months for header
  const months: Date[] = [];
  const current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  while (current <= maxDate) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const getPosition = (date: string) => {
    const d = new Date(date);
    const daysDiff = Math.ceil((d.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    return (daysDiff / totalDays) * 100;
  };

  const getWidth = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return (days / totalDays) * 100;
  };

  return (
    <div className="masira-card overflow-hidden">
      <h3 className="text-lg font-semibold text-foreground mb-4">Project Timeline</h3>
      
      <div className="overflow-x-auto masira-scrollbar">
        <div className="min-w-[800px]">
          {/* Timeline Header */}
          <div className="flex border-b border-border mb-2">
            <div className="w-48 flex-shrink-0 p-2 font-medium text-sm text-muted-foreground">Project</div>
            <div className="flex-1 flex">
              {months.map((month, i) => (
                <div
                  key={i}
                  className="flex-1 p-2 text-sm font-medium text-muted-foreground text-center border-l border-border"
                >
                  {month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          {projects.map(project => (
            <div key={project.id} className="group">
              {/* Project Row */}
              <div className="flex items-center border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <div className="w-48 flex-shrink-0 p-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      project.health === 'on-track' && 'bg-[hsl(var(--success))]',
                      project.health === 'at-risk' && 'bg-[hsl(var(--warning))]',
                      project.health === 'critical' && 'bg-destructive'
                    )} />
                    <span className="font-medium text-sm text-foreground truncate">{project.name}</span>
                  </div>
                </div>
                <div className="flex-1 relative h-10">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex">
                    {months.map((_, i) => (
                      <div key={i} className="flex-1 border-l border-border/30" />
                    ))}
                  </div>
                  {/* Project bar */}
                  <div
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-6 rounded-md flex items-center px-2',
                      project.health === 'on-track' && 'bg-[hsl(var(--success))]/20 border border-[hsl(var(--success))]/40',
                      project.health === 'at-risk' && 'bg-[hsl(var(--warning))]/20 border border-[hsl(var(--warning))]/40',
                      project.health === 'critical' && 'bg-destructive/20 border border-destructive/40'
                    )}
                    style={{
                      left: `${getPosition(project.startDate)}%`,
                      width: `${getWidth(project.startDate, project.endDate)}%`,
                    }}
                  >
                    <div
                      className={cn(
                        'h-full rounded-md absolute left-0 top-0',
                        project.health === 'on-track' && 'bg-[hsl(var(--success))]/40',
                        project.health === 'at-risk' && 'bg-[hsl(var(--warning))]/40',
                        project.health === 'critical' && 'bg-destructive/40'
                      )}
                      style={{ width: `${project.progress}%` }}
                    />
                    <span className="relative z-10 text-xs font-medium text-foreground">{project.progress}%</span>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              {project.milestones.map(milestone => (
                <div key={milestone.id} className="flex items-center border-b border-border/30 bg-secondary/10">
                  <div className="w-48 flex-shrink-0 p-2 pl-8">
                    <span className="text-xs text-muted-foreground truncate block">{milestone.name}</span>
                  </div>
                  <div className="flex-1 relative h-8">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex">
                      {months.map((_, i) => (
                        <div key={i} className="flex-1 border-l border-border/20" />
                      ))}
                    </div>
                    {/* Milestone bar */}
                    <div
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 h-4 rounded flex items-center overflow-hidden',
                        milestone.status === 'completed' && 'bg-[hsl(var(--success))]/30',
                        milestone.status === 'in-progress' && 'bg-primary/30',
                        milestone.status === 'upcoming' && 'bg-muted',
                        milestone.status === 'delayed' && 'bg-destructive/30'
                      )}
                      style={{
                        left: `${getPosition(milestone.startDate)}%`,
                        width: `${getWidth(milestone.startDate, milestone.endDate)}%`,
                      }}
                    >
                      <div
                        className={cn(
                          'h-full',
                          milestone.status === 'completed' && 'bg-[hsl(var(--success))]',
                          milestone.status === 'in-progress' && 'bg-primary',
                          milestone.status === 'delayed' && 'bg-destructive'
                        )}
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border text-sm">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[hsl(var(--success))]" />
          Completed
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-primary" />
          In Progress
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-muted" />
          Upcoming
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-destructive" />
          Delayed
        </span>
      </div>
    </div>
  );
};

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetailModal = ({ project, onClose }: ProjectDetailModalProps) => {
  const budgetPercent = Math.round((project.spent / project.budget) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto masira-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground">{project.name}</h2>
                <span className={cn(
                  'masira-badge',
                  project.health === 'on-track' && 'masira-badge-success',
                  project.health === 'at-risk' && 'masira-badge-warning',
                  project.health === 'critical' && 'masira-badge-danger'
                )}>
                  {project.health.replace('-', ' ')}
                </span>
                <span className="masira-badge masira-badge-neutral">{project.category}</span>
              </div>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-lg font-bold text-foreground">{project.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Budget</span>
                <span className="text-lg font-bold text-foreground">{budgetPercent}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    budgetPercent > 90 ? 'bg-destructive' : 'bg-primary'
                  )}
                  style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>${(project.spent / 1000).toFixed(0)}k spent</span>
                <span>${(project.budget / 1000).toFixed(0)}k total</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timeline
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Start:</span>
                <span className="font-medium text-foreground">
                  {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">End:</span>
                <span className="font-medium text-foreground">
                  {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Team */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team ({project.team.length} members)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {project.team.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={teamAvatars[member.name]} alt={member.name} />
                    <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-foreground">{member.allocation}%</span>
                    <p className="text-xs text-muted-foreground">allocation</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Milestones ({project.milestones.length})
            </h3>
            <div className="space-y-2">
              {project.milestones.map(milestone => (
                <div key={milestone.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    milestone.status === 'completed' && 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]',
                    milestone.status === 'in-progress' && 'bg-primary/20 text-primary',
                    milestone.status === 'upcoming' && 'bg-muted text-muted-foreground',
                    milestone.status === 'delayed' && 'bg-destructive/20 text-destructive'
                  )}>
                    {milestone.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                    {milestone.status === 'in-progress' && <Clock className="w-4 h-4" />}
                    {milestone.status === 'upcoming' && <Circle className="w-4 h-4" />}
                    {milestone.status === 'delayed' && <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{milestone.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(milestone.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(milestone.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="w-24">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{milestone.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          milestone.status === 'completed' && 'bg-[hsl(var(--success))]',
                          milestone.status === 'in-progress' && 'bg-primary',
                          milestone.status === 'delayed' && 'bg-destructive'
                        )}
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsView;
