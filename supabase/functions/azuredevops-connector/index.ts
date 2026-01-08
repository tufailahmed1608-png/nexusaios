import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AzureDevOpsProject {
  id: string;
  name: string;
  description?: string;
  state: string;
}

interface AzureDevOpsWorkItem {
  id: number;
  fields: {
    'System.Title': string;
    'System.Description'?: string;
    'System.State': string;
    'System.AssignedTo'?: { displayName: string };
    'Microsoft.VSTS.Common.Priority'?: number;
    'Microsoft.VSTS.Scheduling.DueDate'?: string;
    'System.WorkItemType': string;
    'System.TeamProject': string;
  };
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

    const { action, integrationId, adoConfig } = await req.json();

    // Get integration config from database or use provided config
    let config = adoConfig;
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

    if (!config?.organization || !config?.pat) {
      return new Response(JSON.stringify({ 
        error: 'Missing Azure DevOps configuration: organization and pat (Personal Access Token) required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adoAuth = btoa(`:${config.pat}`);
    const adoBaseUrl = `https://dev.azure.com/${config.organization}`;

    console.log(`Azure DevOps connector action: ${action} for org: ${config.organization}`);

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
          result = await testConnection(adoBaseUrl, adoAuth);
          break;
        case 'sync_projects':
          result = await syncProjects(adoBaseUrl, adoAuth, supabaseClient);
          recordsSynced = result.projectsSynced;
          break;
        case 'sync_work_items':
          result = await syncWorkItems(adoBaseUrl, adoAuth, supabaseClient, config.project);
          recordsSynced = result.workItemsSynced;
          break;
        case 'sync_all':
          const projectsResult = await syncProjects(adoBaseUrl, adoAuth, supabaseClient);
          const workItemsResult = await syncWorkItems(adoBaseUrl, adoAuth, supabaseClient);
          result = {
            projectsSynced: projectsResult.projectsSynced,
            workItemsSynced: workItemsResult.workItemsSynced
          };
          recordsSynced = projectsResult.projectsSynced + workItemsResult.workItemsSynced;
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
    console.error('Azure DevOps connector error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function testConnection(baseUrl: string, auth: string): Promise<{ connected: boolean; organization?: string }> {
  const response = await fetch(`${baseUrl}/_apis/projects?api-version=7.0`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Azure DevOps connection failed: ${error}`);
  }

  const data = await response.json();
  return { connected: true, organization: baseUrl.split('/').pop() };
}

async function syncProjects(baseUrl: string, auth: string, supabase: any): Promise<{ projectsSynced: number }> {
  const response = await fetch(`${baseUrl}/_apis/projects?api-version=7.0`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Azure DevOps projects: ${response.statusText}`);
  }

  const data = await response.json();
  const projects: AzureDevOpsProject[] = data.value || [];
  let synced = 0;

  for (const project of projects) {
    const healthMap: { [key: string]: string } = {
      'wellFormed': 'on-track',
      'deleting': 'at-risk',
      'new': 'on-track',
      'createPending': 'on-track'
    };

    const projectData = {
      external_id: `ado-${project.id}`,
      source: 'azure_devops',
      name: project.name,
      description: project.description || null,
      health: healthMap[project.state] || 'on-track',
      priority: 'medium',
      category: 'Development',
      raw_data: project
    };

    const { error } = await supabase
      .from('projects_sync')
      .upsert(projectData, { onConflict: 'external_id' });

    if (!error) synced++;
  }

  console.log(`Synced ${synced} Azure DevOps projects`);
  return { projectsSynced: synced };
}

async function syncWorkItems(baseUrl: string, auth: string, supabase: any, projectName?: string): Promise<{ workItemsSynced: number }> {
  // First, get all projects if no specific project is provided
  let projects: string[] = [];
  
  if (projectName) {
    projects = [projectName];
  } else {
    const projectsResponse = await fetch(`${baseUrl}/_apis/projects?api-version=7.0`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    
    if (projectsResponse.ok) {
      const data = await projectsResponse.json();
      projects = (data.value || []).map((p: AzureDevOpsProject) => p.name);
    }
  }

  let totalSynced = 0;

  for (const project of projects) {
    try {
      // Use WIQL to query work items
      const wiqlQuery = {
        query: `SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = '${project}' ORDER BY [System.ChangedDate] DESC`
      };

      const wiqlResponse = await fetch(`${baseUrl}/${encodeURIComponent(project)}/_apis/wit/wiql?api-version=7.0`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(wiqlQuery)
      });

      if (!wiqlResponse.ok) continue;

      const wiqlData = await wiqlResponse.json();
      const workItemIds = (wiqlData.workItems || []).slice(0, 100).map((wi: { id: number }) => wi.id);

      if (workItemIds.length === 0) continue;

      // Fetch work item details
      const idsParam = workItemIds.join(',');
      const workItemsResponse = await fetch(
        `${baseUrl}/_apis/wit/workitems?ids=${idsParam}&api-version=7.0`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!workItemsResponse.ok) continue;

      const workItemsData = await workItemsResponse.json();
      const workItems: AzureDevOpsWorkItem[] = workItemsData.value || [];

      for (const workItem of workItems) {
        const statusMap: { [key: string]: string } = {
          'New': 'todo',
          'Active': 'in-progress',
          'Resolved': 'in-progress',
          'Closed': 'done',
          'Removed': 'done'
        };

        const priorityMap: { [key: number]: string } = {
          1: 'critical',
          2: 'high',
          3: 'medium',
          4: 'low'
        };

        const taskData = {
          external_id: `ado-${workItem.id}`,
          source: 'azure_devops',
          project_external_id: `ado-${project}`,
          title: workItem.fields['System.Title'],
          description: workItem.fields['System.Description'] || null,
          status: statusMap[workItem.fields['System.State']] || 'todo',
          priority: priorityMap[workItem.fields['Microsoft.VSTS.Common.Priority'] || 3] || 'medium',
          assignee: workItem.fields['System.AssignedTo']?.displayName || null,
          due_date: workItem.fields['Microsoft.VSTS.Scheduling.DueDate'] || null,
          tags: [workItem.fields['System.WorkItemType']],
          raw_data: workItem
        };

        const { error } = await supabase
          .from('tasks_sync')
          .upsert(taskData, { onConflict: 'external_id' });

        if (!error) totalSynced++;
      }
    } catch (projectError) {
      console.error(`Error syncing work items for project ${project}:`, projectError);
    }
  }

  console.log(`Synced ${totalSynced} Azure DevOps work items`);
  return { workItemsSynced: totalSynced };
}
