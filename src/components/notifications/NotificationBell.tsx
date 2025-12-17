import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  FileText,
  TrendingUp,
  Sparkles,
  X,
  Settings,
  BellOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'deadline' | 'risk' | 'update' | 'mention' | 'task' | 'milestone';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  time: string;
  read: boolean;
  aiGenerated?: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'deadline',
    priority: 'critical',
    title: 'Beta Launch Tomorrow',
    description: 'Project "Digital Transformation" beta launch deadline is in 24 hours. 3 tasks remaining.',
    time: '10 mins ago',
    read: false,
    aiGenerated: true,
  },
  {
    id: '2',
    type: 'risk',
    priority: 'high',
    title: 'Budget Overrun Risk Detected',
    description: 'AI detected Q4 Launch project is trending 15% over budget. Review recommended.',
    time: '32 mins ago',
    read: false,
    aiGenerated: true,
  },
  {
    id: '3',
    type: 'mention',
    priority: 'high',
    title: 'Sarah Mitchell mentioned you',
    description: 'In the stakeholder meeting notes: "Need @PM to review security requirements..."',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '4',
    type: 'task',
    priority: 'medium',
    title: 'New tasks extracted from meeting',
    description: 'AI extracted 5 action items from "Q4 Planning" meeting. Review and assign.',
    time: '2 hours ago',
    read: false,
    aiGenerated: true,
  },
  {
    id: '5',
    type: 'milestone',
    priority: 'medium',
    title: 'Milestone Achieved',
    description: 'Phase 1 API Integration completed ahead of schedule.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '6',
    type: 'update',
    priority: 'low',
    title: 'Weekly report ready',
    description: 'Your auto-generated weekly status report is ready for review.',
    time: '5 hours ago',
    read: true,
    aiGenerated: true,
  },
  {
    id: '7',
    type: 'risk',
    priority: 'medium',
    title: 'Resource conflict detected',
    description: 'David Park is assigned to 3 overlapping tasks this week.',
    time: '6 hours ago',
    read: true,
    aiGenerated: true,
  },
];

const priorityConfig = {
  critical: {
    color: 'bg-red-500',
    textColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    label: 'Critical',
  },
  high: {
    color: 'bg-amber-500',
    textColor: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    label: 'High',
  },
  medium: {
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    label: 'Medium',
  },
  low: {
    color: 'bg-muted-foreground',
    textColor: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-border',
    label: 'Low',
  },
};

const typeIcons: Record<string, React.ElementType> = {
  deadline: Clock,
  risk: AlertTriangle,
  update: FileText,
  mention: Users,
  task: CheckCircle2,
  milestone: TrendingUp,
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => !n.read && n.priority === 'critical').length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className={cn(
              "absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium text-white",
              criticalCount > 0 ? "bg-red-500 animate-pulse" : "bg-primary"
            )}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} new</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* AI Priority Banner */}
        {criticalCount > 0 && (
          <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-500 font-medium">
              {criticalCount} critical alert{criticalCount > 1 ? 's' : ''} requiring attention
            </span>
          </div>
        )}

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
              <BellOff className="h-12 w-12 mb-3" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm">No notifications to show</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const config = priorityConfig[notification.priority];
                const Icon = typeIcons[notification.type] || Bell;

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-muted/50 cursor-pointer transition-colors relative group",
                      !notification.read && "bg-primary/5"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      {/* Priority indicator */}
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        config.bgColor
                      )}>
                        <Icon className={cn("h-5 w-5", config.textColor)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "font-medium text-sm text-foreground",
                              !notification.read && "font-semibold"
                            )}>
                              {notification.title}
                            </p>
                            {notification.aiGenerated && (
                              <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => dismissNotification(notification.id, e)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", config.textColor, config.borderColor)}
                          >
                            {config.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-2", config.color)} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>AI prioritizes notifications based on urgency and impact</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
