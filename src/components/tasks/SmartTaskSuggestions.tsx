import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Loader2, 
  Plus, 
  Clock, 
  User,
  Calendar,
  CheckCircle2,
  Lightbulb,
  ListTodo,
  Zap,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TaskSuggestion {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  estimatedEffort: string;
  deadline: string | null;
  assignee: string | null;
  reason: string;
}

interface SmartTaskSuggestionsProps {
  content: string;
  contentType: 'email' | 'meeting';
  sender?: string;
  subject?: string;
  onTaskAdded?: (task: TaskSuggestion) => void;
  compact?: boolean;
}

const SmartTaskSuggestions = ({ 
  content, 
  contentType, 
  sender, 
  subject,
  onTaskAdded,
  compact = false 
}: SmartTaskSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedTasks, setAddedTasks] = useState<Set<number>>(new Set());

  const generateSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    setAddedTasks(new Set());

    try {
      const { data, error } = await supabase.functions.invoke('suggest-tasks', {
        body: {
          content,
          contentType,
          sender,
          subject,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setSuggestions(data.suggestions || []);
      setSummary(data.summary || '');
      
      if (data.suggestions?.length > 0) {
        toast.success(`Found ${data.suggestions.length} task suggestions`);
      } else {
        toast.info('No actionable tasks found in content');
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = (task: TaskSuggestion) => {
    setAddedTasks(prev => new Set(prev).add(task.id));
    onTaskAdded?.(task);
    toast.success(`Task "${task.title}" added to board`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/20 text-destructive';
      case 'medium': return 'bg-amber-500/20 text-amber-600 dark:text-amber-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'development': return '💻';
      case 'design': return '🎨';
      case 'review': return '👀';
      case 'meeting': return '📅';
      case 'documentation': return '📝';
      default: return '📋';
    }
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span>Smart Task Suggestions</span>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={generateSuggestions}
            disabled={isLoading}
            className="gap-1"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            {suggestions.length > 0 ? 'Refresh' : 'Suggest Tasks'}
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing content...
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-2">
            {suggestions.slice(0, 3).map((task) => (
              <div 
                key={task.id} 
                className={cn(
                  "flex items-start justify-between gap-2 p-2 rounded-lg border bg-card/50",
                  addedTasks.has(task.id) && "opacity-60"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs">{getCategoryIcon(task.category)}</span>
                    <span className="text-sm font-medium truncate">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0", getPriorityColor(task.priority))}>
                      {task.priority}
                    </Badge>
                    {task.estimatedEffort && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {task.estimatedEffort}
                      </span>
                    )}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="h-7 w-7 p-0 flex-shrink-0"
                  onClick={() => handleAddTask(task)}
                  disabled={addedTasks.has(task.id)}
                >
                  {addedTasks.has(task.id) ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
            {suggestions.length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                +{suggestions.length - 3} more suggestions
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            Smart Task Suggestions
          </CardTitle>
          <Button 
            size="sm" 
            onClick={generateSuggestions}
            disabled={isLoading}
            className="gap-1"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            {suggestions.length > 0 ? 'Regenerate' : 'Analyze & Suggest'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!suggestions.length && !isLoading && (
          <div className="text-center py-6">
            <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-3">
              <ListTodo className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Click "Analyze & Suggest" to extract actionable tasks from this {contentType}.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Analyzing {contentType} content...</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-4">
            {summary && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
                {summary}
              </div>
            )}

            <div className="space-y-3">
              {suggestions.map((task) => (
                <div 
                  key={task.id} 
                  className={cn(
                    "p-3 rounded-lg border bg-card transition-all",
                    addedTasks.has(task.id) && "opacity-60 bg-muted/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{getCategoryIcon(task.category)}</span>
                        <span className="font-medium text-sm">{task.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className={cn("text-xs", getPriorityColor(task.priority))}>
                          <Zap className="h-2.5 w-2.5 mr-1" />
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Tag className="h-2.5 w-2.5 mr-1" />
                          {task.category}
                        </Badge>
                        {task.estimatedEffort && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-2.5 w-2.5 mr-1" />
                            {task.estimatedEffort}
                          </Badge>
                        )}
                        {task.deadline && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-2.5 w-2.5 mr-1" />
                            {task.deadline}
                          </Badge>
                        )}
                        {task.assignee && (
                          <Badge variant="outline" className="text-xs">
                            <User className="h-2.5 w-2.5 mr-1" />
                            {task.assignee}
                          </Badge>
                        )}
                      </div>

                      {task.reason && (
                        <p className="text-[10px] text-muted-foreground mt-2 italic">
                          💡 {task.reason}
                        </p>
                      )}
                    </div>

                    <Button 
                      size="sm" 
                      variant={addedTasks.has(task.id) ? "ghost" : "default"}
                      onClick={() => handleAddTask(task)}
                      disabled={addedTasks.has(task.id)}
                      className="gap-1 flex-shrink-0"
                    >
                      {addedTasks.has(task.id) ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          Add Task
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartTaskSuggestions;
