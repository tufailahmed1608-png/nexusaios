import { cn } from '@/lib/utils';
import { projects } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';

const ProjectList = () => {
  return (
    <div className="nexus-card nexus-slide-up" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Active Projects</h3>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">{project.name}</h4>
              <span
                className={cn(
                  'nexus-badge',
                  project.health === 'on-track' && 'nexus-badge-success',
                  project.health === 'at-risk' && 'nexus-badge-warning',
                  project.health === 'critical' && 'nexus-badge-danger'
                )}
              >
                {project.health === 'on-track' ? 'On Track' : project.health === 'at-risk' ? 'At Risk' : 'Critical'}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Budget: ${(project.spent / 1000).toFixed(0)}k / ${(project.budget / 1000).toFixed(0)}k
              </span>
              <div className="flex -space-x-2">
                {project.team.slice(0, 3).map((member, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium text-primary"
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
