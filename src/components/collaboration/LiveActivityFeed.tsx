import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckSquare,
  FolderKanban,
  FileText,
  Video,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { ActivityEvent } from '@/hooks/useRealtimeActivity';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiveActivityFeedProps {
  activities: ActivityEvent[];
  className?: string;
}

const getActivityIcon = (targetType: ActivityEvent['targetType']) => {
  switch (targetType) {
    case 'task':
      return CheckSquare;
    case 'project':
      return FolderKanban;
    case 'document':
      return FileText;
    case 'meeting':
      return Video;
    case 'comment':
      return MessageSquare;
    default:
      return Zap;
  }
};

const getActivityColor = (targetType: ActivityEvent['targetType']) => {
  switch (targetType) {
    case 'task':
      return 'text-success bg-success/10';
    case 'project':
      return 'text-primary bg-primary/10';
    case 'document':
      return 'text-warning bg-warning/10';
    case 'meeting':
      return 'text-purple-500 bg-purple-500/10';
    case 'comment':
      return 'text-blue-500 bg-blue-500/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

const LiveActivityFeed = ({ activities, className }: LiveActivityFeedProps) => {
  if (activities.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No recent activity</p>
        <p className="text-xs">Team actions will appear here in real-time</p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn('h-[300px]', className)}>
      <div className="space-y-1 pr-4">
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.targetType);
          const colorClass = getActivityColor(activity.targetType);
          const isNew = index === 0;

          return (
            <div
              key={activity.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg transition-all',
                'hover:bg-secondary/50',
                isNew && 'animate-pulse bg-primary/5'
              )}
            >
              <div className={cn('p-2 rounded-lg shrink-0', colorClass)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.userEmail.split('@')[0]}</span>
                  {' '}
                  <span className="text-muted-foreground">{activity.action}</span>
                  {' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default LiveActivityFeed;
