import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ServiceNowProject {
  sys_id: string;
  number: string;
  short_description: string;
  description?: string;
  state: string;
  priority: string;
  start_date?: string;
  end_date?: string;
}

interface ServiceNowTask {
  sys_id: string;
  number: string;
  short_description: string;
  description?: string;
  state: string;
  priority: string;
  assigned_to?: { display_value: string };
  due_date?: string;
  parent?: { value: string };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, integrationId, snowConfig } = await req.json();

    // Get integration config from database or use provided config
    let config = snowConfig;
    if (integrationId && !config) {
      const { data: integration, error: integrationError } = await supabaseClient
        .from('integration_configs')
        .select('config')
        .eq('id', integrationId)
        .single();

      if (integrationError || !integration) {
        return new Response(JSON.stringify({ error: 'Integration not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      config = integration.config;
    }

    if (!config?.instance || !config?.username || !config?.password) {
      return new Response(JSON.stringify({ 
        error: 'Missing ServiceNow configuration: instance, username, and password required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const snowAuth = btoa(`${config.username}:${config.password}`);
    const snowBaseUrl = `https://${config.instance}.service-now.com/api/now`;

    console.log(`ServiceNow connector action: ${action} for instance: ${config.instance}`);

    // Create sync log
    let syncLogId: string | null = null;
    if (integrationId) {
      const { data: syncLog } = await supabaseClient
        .from('integration_sync_logs')
        .insert({
          integration_id: integrationId,
          status: 'running',
          sync_details: { action }
        })
        .select('id')
        .single();
      syncLogId = syncLog?.id;
    }

    let result;
    let recordsSynced = 0;

    try {
      switch (action) {
        case 'test':
          result = await testConnection(snowBaseUrl, snowAuth);
          break;
        case 'sync_projects':
          result = await syncProjects(snowBaseUrl, snowAuth, supabaseClient);
          recordsSynced = result.projectsSynced;
          break;
        case 'sync_tasks':
          result = await syncTasks(snowBaseUrl, snowAuth, supabaseClient);
          recordsSynced = result.tasksSynced;
          break;
        case 'sync_demands':
          result = await syncDemands(snowBaseUrl, snowAuth, supabaseClient);
          recordsSynced = result.demandsSynced;
          break;
        case 'sync_all':
          const projectsResult = await syncProjects(snowBaseUrl, snowAuth, supabaseClient);
          const tasksResult = await syncTasks(snowBaseUrl, snowAuth, supabaseClient);
          const demandsResult = await syncDemands(snowBaseUrl, snowAuth, supabaseClient);
          result = {
            projectsSynced: projectsResult.projectsSynced,
            tasksSynced: tasksResult.tasksSynced,
            demandsSynced: demandsResult.demandsSynced
          };
          recordsSynced = projectsResult.projectsSynced + tasksResult.tasksSynced + demandsResult.demandsSynced;
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      // Update sync log on success
      if (syncLogId) {
        await supabaseClient
          .from('integration_sync_logs')
          .update({
            status: 'success',
            records_synced: recordsSynced,
            completed_at: new Date().toISOString(),
            sync_details: result
          })
          .eq('id', syncLogId);

        // Update last_sync_at on integration
        await supabaseClient
          .from('integration_configs')
          .update({ last_sync_at: new Date().toISOString() })
          .eq('id', integrationId);
      }

      return new Response(JSON.stringify({ success: true, data: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (syncError: unknown) {
      const errorMessage = syncError instanceof Error ? syncError.message : 'Unknown error';
      if (syncLogId) {
        await supabaseClient
          .from('integration_sync_logs')
          .update({
            status: 'failed',
            error_message: errorMessage,
            completed_at: new Date().toISOString()
          })
          .eq('id', syncLogId);
      }
      throw syncError;
    }

  } catch (error: unknown) {
    console.error('ServiceNow connector error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function testConnection(baseUrl: string, auth: string): Promise<{ connected: boolean; instance?: string }> {
  const response = await fetch(`${baseUrl}/table/sys_user?sysparm_limit=1`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ServiceNow connection failed: ${error}`);
  }

  return { connected: true, instance: baseUrl.split('.')[0].replace('https://', '') };
}

async function syncProjects(baseUrl: string, auth: string, supabase: any): Promise<{ projectsSynced: number }> {
  // Try PPM Projects table first, fallback to Project table
  let response = await fetch(`${baseUrl}/table/pm_project?sysparm_limit=100`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    // Fallback to generic project table
    response = await fetch(`${baseUrl}/table/pm_portfolio?sysparm_limit=100`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
  }

  if (!response.ok) {
    console.log('No PPM tables found, checking for incident-based projects');
    return { projectsSynced: 0 };
  }

  const data = await response.json();
  const projects: ServiceNowProject[] = data.result || [];
  let synced = 0;

  const stateMap: { [key: string]: string } = {
    '1': 'on-track',
    '2': 'on-track',
    '3': 'at-risk',
    '4': 'at-risk',
    '5': 'off-track',
    '6': 'done',
    '7': 'done'
  };

  const priorityMap: { [key: string]: string } = {
    '1': 'critical',
    '2': 'high',
    '3': 'medium',
    '4': 'low',
    '5': 'low'
  };

  for (const project of projects) {
    const projectData = {
      external_id: `snow-${project.sys_id}`,
      source: 'servicenow',
      name: project.short_description || project.number,
      description: project.description || null,
      health: stateMap[project.state] || 'on-track',
      priority: priorityMap[project.priority] || 'medium',
      start_date: project.start_date || null,
      end_date: project.end_date || null,
      category: 'ServiceNow PPM',
      raw_data: project
    };

    const { error } = await supabase
      .from('projects_sync')
      .upsert(projectData, { onConflict: 'external_id' });

    if (!error) synced++;
  }

  console.log(`Synced ${synced} ServiceNow projects`);
  return { projectsSynced: synced };
}

async function syncTasks(baseUrl: string, auth: string, supabase: any): Promise<{ tasksSynced: number }> {
  // Fetch project tasks
  const response = await fetch(`${baseUrl}/table/pm_project_task?sysparm_limit=200`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    console.log('No project tasks table found');
    return { tasksSynced: 0 };
  }

  const data = await response.json();
  const tasks: ServiceNowTask[] = data.result || [];
  let synced = 0;

  const stateMap: { [key: string]: string } = {
    '1': 'todo',
    '2': 'in-progress',
    '3': 'done',
    '-5': 'todo'
  };

  const priorityMap: { [key: string]: string } = {
    '1': 'critical',
    '2': 'high',
    '3': 'medium',
    '4': 'low'
  };

  for (const task of tasks) {
    const taskData = {
      external_id: `snow-${task.sys_id}`,
      source: 'servicenow',
      project_external_id: task.parent?.value ? `snow-${task.parent.value}` : null,
      title: task.short_description || task.number,
      description: task.description || null,
      status: stateMap[task.state] || 'todo',
      priority: priorityMap[task.priority] || 'medium',
      assignee: task.assigned_to?.display_value || null,
      due_date: task.due_date || null,
      tags: ['ServiceNow'],
      raw_data: task
    };

    const { error } = await supabase
      .from('tasks_sync')
      .upsert(taskData, { onConflict: 'external_id' });

    if (!error) synced++;
  }

  console.log(`Synced ${synced} ServiceNow tasks`);
  return { tasksSynced: synced };
}

async function syncDemands(baseUrl: string, auth: string, supabase: any): Promise<{ demandsSynced: number }> {
  // Fetch demand management records
  const response = await fetch(`${baseUrl}/table/dmn_demand?sysparm_limit=100`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    console.log('No demand table found');
    return { demandsSynced: 0 };
  }

  const data = await response.json();
  const demands = data.result || [];
  let synced = 0;

  for (const demand of demands) {
    const projectData = {
      external_id: `snow-demand-${demand.sys_id}`,
      source: 'servicenow',
      name: demand.short_description || demand.number,
      description: demand.description || null,
      health: 'on-track',
      priority: 'medium',
      category: 'Demand',
      raw_data: demand
    };

    const { error } = await supabase
      .from('projects_sync')
      .upsert(projectData, { onConflict: 'external_id' });

    if (!error) synced++;
  }

  console.log(`Synced ${synced} ServiceNow demands`);
  return { demandsSynced: synced };
}
