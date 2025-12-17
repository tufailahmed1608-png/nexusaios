import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Circle, Users } from 'lucide-react';
import { PresenceUser } from '@/hooks/usePresence';

interface OnlineUsersProps {
  users: PresenceUser[];
  maxVisible?: number;
}

const getStatusColor = (status: PresenceUser['status']) => {
  switch (status) {
    case 'online':
      return 'bg-success';
    case 'away':
      return 'bg-warning';
    case 'busy':
      return 'bg-destructive';
    default:
      return 'bg-muted-foreground';
  }
};

const getViewLabel = (view?: string) => {
  const labels: Record<string, string> = {
    dashboard: 'Dashboard',
    inbox: 'Smart Inbox',
    tasks: 'Task Board',
    calendar: 'Calendar',
    meetings: 'Meeting Hub',
    projects: 'Projects',
    documents: 'Documents',
    stakeholders: 'Stakeholders',
    reports: 'Reports',
    activity: 'Activity',
    strategy: 'Strategy',
    team: 'Team',
  };
  return labels[view || ''] || view || 'Unknown';
};

const OnlineUsers = ({ users, maxVisible = 3 }: OnlineUsersProps) => {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = Math.max(0, users.length - maxVisible);

  if (users.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
          <div className="flex -space-x-2">
            {visibleUsers.map((user) => (
              <TooltipProvider key={user.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Avatar className="w-7 h-7 border-2 border-card">
                        <AvatarImage src={user.avatarUrl} alt={user.email} />
                        <AvatarFallback className="bg-primary text-[10px] font-medium text-primary-foreground">
                          {user.email.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card',
                          getStatusColor(user.status)
                        )}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p className="font-medium">{user.displayName || user.email}</p>
                    <p className="text-muted-foreground">Viewing {getViewLabel(user.currentView)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {remainingCount > 0 && (
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[10px] font-medium text-foreground border-2 border-card">
                +{remainingCount}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {users.length} online
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm">Team Online</h4>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors"
            >
              <div className="relative">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={user.avatarUrl} alt={user.email} />
                  <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
                    {user.email.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card',
                    getStatusColor(user.status)
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.displayName || user.email}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Circle className="w-2 h-2 fill-current" />
                  {getViewLabel(user.currentView)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default OnlineUsers;
