import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { kpis as mockKpis, projects as mockProjects, tasks as mockTasks } from '@/data/mockData';
import type { KPI, Project, Task } from '@/data/mockData';

interface SyncedProject {
  id: string;
  external_id: string;
  source: string;
  name: string;
  description: string | null;
  health: string;
  progress: number;
  budget: number;
  spent: number;
  start_date: string | null;
  end_date: string | null;
  priority: string;
  category: string | null;
  team_data: unknown[];
  milestones_data: unknown[];
  raw_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface SyncedKPI {
  id: string;
  source: string;
  title: string;
  value: string;
  change: number;
  trend: string;
  icon: string;
  raw_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface SyncedTask {
  id: string;
  external_id: string;
  source: string;
  project_external_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignee: string | null;
  due_date: string | null;
  tags: string[];
  raw_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Transform synced project to app format
function transformProject(syncedProject: SyncedProject): Project {
  return {
    id: syncedProject.external_id,
    name: syncedProject.name,
    description: syncedProject.description || '',
    health: (syncedProject.health as 'on-track' | 'at-risk' | 'critical') || 'on-track',
    progress: syncedProject.progress || 0,
    budget: syncedProject.budget || 0,
    spent: syncedProject.spent || 0,
    team: (syncedProject.team_data || []).map((member: unknown, idx: number) => {
      const m = member as Record<string, unknown>;
      return {
        id: String(m.id || idx),
        name: String(m.name || 'Unknown'),
        role: String(m.role || 'Team Member'),
        avatar: String(m.avatar || ''),
        allocation: Number(m.allocation || 100),
      };
    }),
    milestones: (syncedProject.milestones_data || []).map((ms: unknown, idx: number) => {
      const m = ms as Record<string, unknown>;
      return {
        id: String(m.id || idx),
        name: String(m.name || 'Milestone'),
        startDate: String(m.startDate || m.start_date || new Date().toISOString()),
        endDate: String(m.endDate || m.end_date || new Date().toISOString()),
        progress: Number(m.progress || 0),
        status: (m.status as 'completed' | 'in-progress' | 'upcoming' | 'delayed') || 'upcoming',
      };
    }),
    startDate: syncedProject.start_date || new Date().toISOString(),
    endDate: syncedProject.end_date || new Date().toISOString(),
    priority: (syncedProject.priority as 'critical' | 'high' | 'medium' | 'low') || 'medium',
    category: syncedProject.category || 'General',
  };
}

// Transform synced KPI to app format
function transformKPI(syncedKPI: SyncedKPI, idx: number): KPI {
  return {
    id: syncedKPI.id || String(idx),
    title: syncedKPI.title,
    value: syncedKPI.value,
    change: syncedKPI.change || 0,
    trend: (syncedKPI.trend as 'up' | 'down' | 'stable') || 'stable',
    icon: syncedKPI.icon || 'activity',
  };
}

// Transform synced task to app format
function transformTask(syncedTask: SyncedTask): Task {
  return {
    id: syncedTask.external_id,
    title: syncedTask.title,
    description: syncedTask.description || '',
    status: (syncedTask.status as 'backlog' | 'todo' | 'in-progress' | 'review' | 'done') || 'todo',
    priority: (syncedTask.priority as 'critical' | 'high' | 'medium' | 'low') || 'medium',
    assignee: syncedTask.assignee || 'Unassigned',
    dueDate: syncedTask.due_date || new Date().toISOString().split('T')[0],
    project: syncedTask.project_external_id || 'Unknown Project',
    tags: syncedTask.tags || [],
  };
}

export function useSyncedProjects(source?: string) {
  return useQuery({
    queryKey: ['synced-projects', source],
    queryFn: async () => {
      let query = supabase
        .from('projects_sync')
        .select('*')
        .order('updated_at', { ascending: false });

      if (source) {
        query = query.eq('source', source);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching synced projects:', error);
        return null;
      }

      return data as SyncedProject[];
    },
    staleTime: 30000, // 30 seconds
  });
}

export function useSyncedKPIs(source?: string) {
  return useQuery({
    queryKey: ['synced-kpis', source],
    queryFn: async () => {
      let query = supabase
        .from('kpis_sync')
        .select('*')
        .order('created_at', { ascending: true });

      if (source) {
        query = query.eq('source', source);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching synced KPIs:', error);
        return null;
      }

      return data as SyncedKPI[];
    },
    staleTime: 30000,
  });
}

export function useSyncedTasks(source?: string, projectExternalId?: string) {
  return useQuery({
    queryKey: ['synced-tasks', source, projectExternalId],
    queryFn: async () => {
      let query = supabase
        .from('tasks_sync')
        .select('*')
        .order('updated_at', { ascending: false });

      if (source) {
        query = query.eq('source', source);
      }

      if (projectExternalId) {
        query = query.eq('project_external_id', projectExternalId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching synced tasks:', error);
        return null;
      }

      return data as SyncedTask[];
    },
    staleTime: 30000,
  });
}

// Combined hook that returns synced data with fallback to mock data
export function useDashboardData() {
  const { data: syncedProjects, isLoading: projectsLoading } = useSyncedProjects();
  const { data: syncedKPIs, isLoading: kpisLoading } = useSyncedKPIs();
  const { data: syncedTasks, isLoading: tasksLoading } = useSyncedTasks();

  const isLoading = projectsLoading || kpisLoading || tasksLoading;

  // Use synced data if available, otherwise fall back to mock data
  const projects: Project[] = syncedProjects?.length 
    ? syncedProjects.map(transformProject) 
    : mockProjects;

  const kpis: KPI[] = syncedKPIs?.length 
    ? syncedKPIs.map(transformKPI) 
    : mockKpis;

  const tasks: Task[] = syncedTasks?.length 
    ? syncedTasks.map(transformTask) 
    : mockTasks;

  const hasSyncedData = Boolean(syncedProjects?.length || syncedKPIs?.length || syncedTasks?.length);

  return {
    projects,
    kpis,
    tasks,
    isLoading,
    hasSyncedData,
    syncedProjectsCount: syncedProjects?.length || 0,
    syncedKPIsCount: syncedKPIs?.length || 0,
    syncedTasksCount: syncedTasks?.length || 0,
  };
}
