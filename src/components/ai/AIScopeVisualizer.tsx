import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  EyeOff, 
  Database, 
  FileText, 
  Users, 
  Calendar,
  MessageSquare,
  BarChart3,
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles,
  Settings,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/hooks/useUserRole';
import { getRoleDisplayName } from '@/lib/permissions';

interface DataScope {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  accessLevel: 'full' | 'limited' | 'none';
  dataPoints?: string[];
  isEnabled: boolean;
  category: 'personal' | 'project' | 'organization' | 'external';
}

interface AIScopeVisualizerProps {
  className?: string;
}

const defaultScopes: DataScope[] = [
  {
    id: 'user-profile',
    name: 'Your Profile',
    description: 'Name, role, preferences, and settings',
    icon: Users,
    accessLevel: 'full',
    dataPoints: ['Display name', 'Role', 'Avatar', 'Preferences'],
    isEnabled: true,
    category: 'personal',
  },
  {
    id: 'user-activity',
    name: 'Your Activity',
    description: 'Pages visited, features used, interaction patterns',
    icon: Activity,
    accessLevel: 'full',
    dataPoints: ['Page visits', 'Feature usage', 'Session data'],
    isEnabled: true,
    category: 'personal',
  },
  {
    id: 'projects',
    name: 'Project Data',
    description: 'Projects you have access to view or manage',
    icon: FileText,
    accessLevel: 'limited',
    dataPoints: ['Project names', 'Status', 'Team members', 'Deadlines'],
    isEnabled: true,
    category: 'project',
  },
  {
    id: 'tasks',
    name: 'Tasks & Assignments',
    description: 'Tasks assigned to you and your team',
    icon: CheckCircle,
    accessLevel: 'limited',
    dataPoints: ['Task titles', 'Priorities', 'Due dates', 'Assignees'],
    isEnabled: true,
    category: 'project',
  },
  {
    id: 'meetings',
    name: 'Calendar & Meetings',
    description: 'Scheduled meetings and calendar events',
    icon: Calendar,
    accessLevel: 'limited',
    dataPoints: ['Meeting titles', 'Attendees', 'Times', 'Notes'],
    isEnabled: true,
    category: 'project',
  },
  {
    id: 'messages',
    name: 'Communications',
    description: 'Emails and messages in your inbox',
    icon: MessageSquare,
    accessLevel: 'limited',
    dataPoints: ['Senders', 'Subjects', 'Timestamps'],
    isEnabled: false,
    category: 'personal',
  },
  {
    id: 'documents',
    name: 'Documents',
    description: 'Files and documents in the system',
    icon: Database,
    accessLevel: 'limited',
    dataPoints: ['Document titles', 'Content summaries', 'Metadata'],
    isEnabled: true,
    category: 'project',
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    description: 'Generated reports and metrics',
    icon: BarChart3,
    accessLevel: 'full',
    dataPoints: ['Report data', 'KPIs', 'Trends', 'Forecasts'],
    isEnabled: true,
    category: 'organization',
  },
  {
    id: 'decisions',
    name: 'Decision Log',
    description: 'Organizational decisions and their context',
    icon: Shield,
    accessLevel: 'limited',
    dataPoints: ['Decision titles', 'Stakeholders', 'Outcomes'],
    isEnabled: true,
    category: 'organization',
  },
];

export const AIScopeVisualizer = ({ className }: AIScopeVisualizerProps) => {
  const { role } = useUserRole();
  const [scopes, setScopes] = useState<DataScope[]>(defaultScopes);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleScope = (scopeId: string) => {
    setScopes(prev => 
      prev.map(scope => 
        scope.id === scopeId 
          ? { ...scope, isEnabled: !scope.isEnabled }
          : scope
      )
    );
  };

  const getAccessIcon = (level: DataScope['accessLevel']) => {
    switch (level) {
      case 'full': return Unlock;
      case 'limited': return Eye;
      case 'none': return Lock;
    }
  };

  const getAccessColor = (level: DataScope['accessLevel']) => {
    switch (level) {
      case 'full': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10';
      case 'limited': return 'text-amber-600 dark:text-amber-400 bg-amber-500/10';
      case 'none': return 'text-red-600 dark:text-red-400 bg-red-500/10';
    }
  };

  const getCategoryColor = (category: DataScope['category']) => {
    switch (category) {
      case 'personal': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'project': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'organization': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      case 'external': return 'bg-red-500/10 text-red-600 dark:text-red-400';
    }
  };

  const filteredScopes = selectedCategory === 'all' 
    ? scopes 
    : scopes.filter(s => s.category === selectedCategory);

  const enabledCount = scopes.filter(s => s.isEnabled).length;
  const totalCount = scopes.length;

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Data Scope</CardTitle>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <Eye className="h-3 w-3" />
            {enabledCount}/{totalCount} Active
          </Badge>
        </div>
        <CardDescription>
          Understand and control what data the AI can access to provide recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Role Context */}
        {role && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">
                Viewing as {getRoleDisplayName(role)}
              </p>
              <p className="text-xs text-muted-foreground">
                AI access is scoped to your role permissions
              </p>
            </div>
          </div>
        )}

        {/* Access Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
            <Unlock className="h-5 w-5 mx-auto text-emerald-600 dark:text-emerald-400" />
            <p className="text-lg font-bold mt-1">
              {scopes.filter(s => s.accessLevel === 'full' && s.isEnabled).length}
            </p>
            <p className="text-xs text-muted-foreground">Full Access</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 text-center">
            <Eye className="h-5 w-5 mx-auto text-amber-600 dark:text-amber-400" />
            <p className="text-lg font-bold mt-1">
              {scopes.filter(s => s.accessLevel === 'limited' && s.isEnabled).length}
            </p>
            <p className="text-xs text-muted-foreground">Limited Access</p>
          </div>
          <div className="p-3 rounded-lg bg-muted text-center">
            <EyeOff className="h-5 w-5 mx-auto text-muted-foreground" />
            <p className="text-lg font-bold mt-1">
              {scopes.filter(s => !s.isEnabled).length}
            </p>
            <p className="text-xs text-muted-foreground">Disabled</p>
          </div>
        </div>

        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="project">Project</TabsTrigger>
            <TabsTrigger value="organization">Org</TabsTrigger>
            <TabsTrigger value="external">External</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Scope List */}
        <div className="space-y-3">
          {filteredScopes.map((scope) => {
            const AccessIcon = getAccessIcon(scope.accessLevel);
            const ScopeIcon = scope.icon;
            
            return (
              <div 
                key={scope.id}
                className={cn(
                  'p-4 rounded-lg border transition-all',
                  scope.isEnabled 
                    ? 'bg-card border-border' 
                    : 'bg-muted/30 border-muted'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      scope.isEnabled ? 'bg-primary/10' : 'bg-muted'
                    )}>
                      <ScopeIcon className={cn(
                        'h-5 w-5',
                        scope.isEnabled ? 'text-primary' : 'text-muted-foreground'
                      )} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className={cn(
                          'font-medium',
                          !scope.isEnabled && 'text-muted-foreground'
                        )}>
                          {scope.name}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={cn('text-xs', getCategoryColor(scope.category))}
                        >
                          {scope.category}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn('text-xs gap-1', getAccessColor(scope.accessLevel))}
                        >
                          <AccessIcon className="h-3 w-3" />
                          {scope.accessLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {scope.description}
                      </p>
                      {scope.isEnabled && scope.dataPoints && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {scope.dataPoints.map((point, i) => (
                            <Badge 
                              key={i} 
                              variant="secondary" 
                              className="text-xs"
                            >
                              {point}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={scope.isEnabled}
                    onCheckedChange={() => toggleScope(scope.id)}
                    aria-label={`Toggle ${scope.name} access`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-muted">
          <Info className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Privacy & Transparency</p>
            <p className="text-xs text-muted-foreground">
              AI only accesses data within your role permissions. Disabling a scope prevents AI from using that data for recommendations. Your data is never shared externally.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIScopeVisualizer;
