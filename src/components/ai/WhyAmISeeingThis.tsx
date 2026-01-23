import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  HelpCircle, 
  User, 
  Shield, 
  Filter, 
  Clock, 
  Target,
  Sparkles,
  Database,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/hooks/useUserRole';
import { getRoleDisplayName, AppRole } from '@/lib/permissions';

export interface VisibilityReason {
  type: 'role' | 'ownership' | 'filter' | 'ai' | 'time' | 'personalization' | 'setting';
  title: string;
  description: string;
}

interface WhyAmISeeingThisProps {
  reasons: VisibilityReason[];
  itemType?: string;
  className?: string;
  size?: 'sm' | 'md';
}

const reasonIcons: Record<string, React.ElementType> = {
  role: Shield,
  ownership: User,
  filter: Filter,
  ai: Sparkles,
  time: Clock,
  personalization: Target,
  setting: Settings,
};

export const WhyAmISeeingThis = ({ 
  reasons, 
  itemType = 'item',
  className,
  size = 'sm'
}: WhyAmISeeingThisProps) => {
  const { role } = useUserRole();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            'text-muted-foreground hover:text-foreground',
            size === 'sm' ? 'h-6 w-6' : 'h-8 w-8',
            className
          )}
        >
          <HelpCircle className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
          <span className="sr-only">Why am I seeing this?</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="end"
        side="bottom"
      >
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-sm">Why am I seeing this {itemType}?</h4>
          </div>
          
          {/* Current Role Context */}
          {role && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/10">
              <Shield className="h-4 w-4 text-primary" />
              <div className="text-sm">
                <span className="text-muted-foreground">Your role: </span>
                <span className="font-medium">{getRoleDisplayName(role)}</span>
              </div>
            </div>
          )}

          {/* Reasons List */}
          <div className="space-y-2">
            {reasons.map((reason, index) => {
              const Icon = reasonIcons[reason.type] || HelpCircle;
              return (
                <div 
                  key={index}
                  className="flex gap-3 p-2 rounded-md bg-muted/50"
                >
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{reason.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Preset reasons for common scenarios
// eslint-disable-next-line react-refresh/only-export-components
export const createRoleBasedReason = (role: AppRole, feature: string): VisibilityReason => ({
  type: 'role',
  title: 'Role-based access',
  description: `${getRoleDisplayName(role)} role has access to ${feature}`,
});

// eslint-disable-next-line react-refresh/only-export-components
export const createOwnershipReason = (ownerType: string): VisibilityReason => ({
  type: 'ownership',
  title: 'You created this',
  description: `This ${ownerType} belongs to you`,
});

// eslint-disable-next-line react-refresh/only-export-components
export const createAIReason = (aiType: string): VisibilityReason => ({
  type: 'ai',
  title: 'AI recommendation',
  description: `AI suggested this ${aiType} based on your activity and preferences`,
});

// eslint-disable-next-line react-refresh/only-export-components
export const createFilterReason = (filterName: string): VisibilityReason => ({
  type: 'filter',
  title: 'Active filter',
  description: `Matches your current "${filterName}" filter`,
});

// eslint-disable-next-line react-refresh/only-export-components
export const createTimeReason = (timeframe: string): VisibilityReason => ({
  type: 'time',
  title: 'Recent activity',
  description: `Active within the last ${timeframe}`,
});

// eslint-disable-next-line react-refresh/only-export-components
export const createPersonalizationReason = (basis: string): VisibilityReason => ({
  type: 'personalization',
  title: 'Personalized for you',
  description: `Based on ${basis}`,
});

export default WhyAmISeeingThis;
