import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileEdit,
  Eye,
  CheckCircle,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type AIOutputState = 'draft' | 'reviewed' | 'approved' | 'published';

interface AIOutputStatusProps {
  status: AIOutputState;
  onStatusChange?: (newStatus: AIOutputState) => void;
  showWorkflow?: boolean;
  size?: 'sm' | 'md';
}

const statusConfig: Record<AIOutputState, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  draft: {
    label: 'Draft',
    icon: FileEdit,
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    borderColor: 'border-slate-300 dark:border-slate-600',
  },
  reviewed: {
    label: 'Reviewed',
    icon: Eye,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-300 dark:border-blue-700',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
  },
  published: {
    label: 'Published',
    icon: Globe,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-300 dark:border-purple-700',
  },
};

const statusOrder: AIOutputState[] = ['draft', 'reviewed', 'approved', 'published'];

export const AIOutputStatusBadge = ({ status, size = 'md' }: { status: AIOutputState; size?: 'sm' | 'md' }) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        'gap-1.5 font-medium border',
        config.color,
        config.bgColor,
        config.borderColor,
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
      )}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {config.label}
    </Badge>
  );
};

export const AIOutputStatusWorkflow = ({ 
  status, 
  onStatusChange,
  size = 'md' 
}: AIOutputStatusProps) => {
  const currentIndex = statusOrder.indexOf(status);
  
  const getNextStatus = (): AIOutputState | null => {
    const nextIndex = currentIndex + 1;
    return nextIndex < statusOrder.length ? statusOrder[nextIndex] : null;
  };

  const nextStatus = getNextStatus();
  const nextConfig = nextStatus ? statusConfig[nextStatus] : null;

  return (
    <div className="flex items-center gap-3">
      {/* Status Steps */}
      <div className="flex items-center gap-1">
        {statusOrder.map((step, index) => {
          const config = statusConfig[step];
          const Icon = config.icon;
          const isActive = index <= currentIndex;
          const isCurrent = step === status;
          
          return (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded-md transition-all',
                  isActive ? config.bgColor : 'bg-muted/50',
                  isCurrent && 'ring-2 ring-offset-1 ring-offset-background',
                  isCurrent && config.borderColor.replace('border-', 'ring-')
                )}
              >
                <Icon 
                  className={cn(
                    size === 'sm' ? 'h-3 w-3' : 'h-4 w-4',
                    isActive ? config.color : 'text-muted-foreground/50'
                  )} 
                />
                <span 
                  className={cn(
                    'font-medium hidden sm:inline',
                    size === 'sm' ? 'text-xs' : 'text-sm',
                    isActive ? config.color : 'text-muted-foreground/50'
                  )}
                >
                  {config.label}
                </span>
              </div>
              {index < statusOrder.length - 1 && (
                <ChevronRight 
                  className={cn(
                    'h-4 w-4 mx-0.5',
                    index < currentIndex ? 'text-muted-foreground' : 'text-muted-foreground/30'
                  )} 
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      {nextStatus && onStatusChange && nextConfig && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onStatusChange(nextStatus)}
          className={cn(
            'gap-1.5 ml-2',
            nextConfig.color,
            nextConfig.borderColor
          )}
        >
          <nextConfig.icon className="h-3.5 w-3.5" />
          Mark as {nextConfig.label}
        </Button>
      )}
    </div>
  );
};

export default AIOutputStatusWorkflow;
