import { cn } from '@/lib/utils';
import { projects } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';
import { 
  WhyAmISeeingThis, 
  createRoleBasedReason, 
  createOwnershipReason,
  createFilterReason,
  type VisibilityReason 
} from '@/components/ai/WhyAmISeeingThis';
import { useUserRole } from '@/hooks/useUserRole';

const getProjectReasons = (
  project: typeof projects[0], 
  role: string
): VisibilityReason[] => {
  const reasons: VisibilityReason[] = [];
  
  // Role-based access
  if (role) {
    reasons.push(createRoleBasedReason(role as any, 'project overview'));
  }
  
  // If critical or at-risk, add filter reason
  if (project.health === 'critical') {
    reasons.push({
      type: 'filter',
      title: 'Critical status',
      description: 'This project requires immediate attention due to critical issues',
    });
  } else if (project.health === 'at-risk') {
    reasons.push({
      type: 'filter',
      title: 'At-risk status',
      description: 'This project has risks that need to be monitored',
    });
  }
  
  // Team involvement hint
  reasons.push({
    type: 'personalization',
    title: 'Team visibility',
    description: `You have access to projects within your organizational scope`,
  });
  
  return reasons;
};

const ProjectList = () => {
  const { role } = useUserRole();

  return (
    <div className="nexus-card nexus-slide-up" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Active Projects</h3>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>

      <div className="space-y-3 md:space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-3 md:p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors relative group"
          >
            {/* Why am I seeing this? tooltip */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <WhyAmISeeingThis 
                reasons={getProjectReasons(project, role || 'user')} 
                itemType="project"
                size="sm"
              />
            </div>

            <div className="flex items-start md:items-center justify-between mb-2 md:mb-3 gap-2 pr-8">
              <h4 className="font-medium text-foreground text-sm md:text-base">{project.name}</h4>
              <span
                className={cn(
                  'nexus-badge text-xs whitespace-nowrap',
                  project.health === 'on-track' && 'nexus-badge-success',
                  project.health === 'at-risk' && 'nexus-badge-warning',
                  project.health === 'critical' && 'nexus-badge-danger'
                )}
              >
                {project.health === 'on-track' ? 'On Track' : project.health === 'at-risk' ? 'At Risk' : 'Critical'}
              </span>
            </div>

            <div className="mb-2 md:mb-3">
              <div className="flex items-center justify-between text-xs md:text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-1.5 md:h-2" />
            </div>

            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-muted-foreground">
                ${(project.spent / 1000).toFixed(0)}k / ${(project.budget / 1000).toFixed(0)}k
              </span>
              <div className="flex -space-x-2">
                {project.team.slice(0, 3).map((member, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium text-primary"
                  >
                    {member[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
