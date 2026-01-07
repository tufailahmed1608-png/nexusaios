import { useState } from 'react';
import { cn } from '@/lib/utils';
import { tasks } from '@/data/mockData';
import type { Task } from '@/data/mockData';
import { Calendar, User, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const columns = [
  { id: 'backlog', title: 'Backlog', color: 'bg-muted-foreground' },
  { id: 'todo', title: 'To Do', color: 'bg-primary' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-warning' },
  { id: 'review', title: 'Review', color: 'bg-purple-500' },
  { id: 'done', title: 'Done', color: 'bg-success' },
];

const getPriorityStyles = (priority: Task['priority']) => {
  switch (priority) {
    case 'critical':
      return 'border-l-destructive bg-destructive/5';
    case 'high':
      return 'border-l-warning bg-warning/5';
    case 'medium':
      return 'border-l-primary bg-primary/5';
    default:
      return 'border-l-muted-foreground';
  }
};

const TaskCard = ({ task }: { task: Task }) => {
  return (
    <div
      className={cn(
        'p-4 rounded-lg bg-card border border-border border-l-4 shadow-sm',
        'hover:shadow-md transition-all cursor-grab active:cursor-grabbing',
        getPriorityStyles(task.priority)
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-foreground text-sm leading-tight">{task.title}</h4>
        <span
          className={cn(
            'masira-badge text-[10px] flex-shrink-0',
            task.priority === 'critical' && 'masira-badge-danger',
            task.priority === 'high' && 'masira-badge-warning',
            task.priority === 'medium' && 'bg-primary/10 text-primary',
            task.priority === 'low' && 'masira-badge-neutral'
          )}
        >
          {task.priority}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground"
          >
            <Tag className="w-2.5 h-2.5" />
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{task.assignee.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};

const TaskBoard = () => {
  const [taskList] = useState(tasks);

  const getTasksByStatus = (status: Task['status']) => {
    return taskList.filter((task) => task.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between masira-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Task Board</h2>
          <p className="text-muted-foreground">Manage and track all your tasks</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-4 h-[calc(100vh-220px)]">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className={cn('w-2 h-2 rounded-full', column.color)} />
              <h3 className="font-semibold text-foreground">{column.title}</h3>
              <span className="text-sm text-muted-foreground">
                ({getTasksByStatus(column.id as Task['status']).length})
              </span>
            </div>

            <div className="flex-1 p-3 rounded-xl bg-secondary/20 overflow-y-auto masira-scrollbar space-y-3">
              {getTasksByStatus(column.id as Task['status']).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}

              <button className="w-full p-3 rounded-lg border border-dashed border-border text-muted-foreground text-sm hover:border-primary hover:text-primary transition-colors">
                + Add task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
