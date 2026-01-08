import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JiraProject {
  id: string;
  key: string;
  name: string;
  description?: string;
  lead?: { displayName: string };
}

interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description?: string;
    status: { name: string };
    priority?: { name: string };
    assignee?: { displayName: string };
    duedate?: string;
    issuetype: { name: string };
    project: { key: string; name: string };
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

    const { action, integrationId, jiraConfig } = await req.json();

    // Get integration config from database or use provided config
    let config = jiraConfig;
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

    if (!config?.domain || !config?.email || !config?.apiToken) {
      return new Response(JSON.stringify({ 
        error: 'Missing Jira configuration: domain, email, and apiToken required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const jiraAuth = btoa(`${config.email}:${config.apiToken}`);
    const jiraBaseUrl = `https://${config.domain}.atlassian.net/rest/api/3`;

    console.log(`Jira connector action: ${action} for domain: ${config.domain}`);

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
          result = await testConnection(jiraBaseUrl, jiraAuth);
          break;
        case 'sync_projects':
          result = await syncProjects(jiraBaseUrl, jiraAuth, supabaseClient);
          recordsSynced = result.projectsSynced;
          break;
        case 'sync_issues':
          result = await syncIssues(jiraBaseUrl, jiraAuth, supabaseClient, config.projectKey);
          recordsSynced = result.issuesSynced;
          break;
        case 'sync_all':
          const projectsResult = await syncProjects(jiraBaseUrl, jiraAuth, supabaseClient);
          const issuesResult = await syncIssues(jiraBaseUrl, jiraAuth, supabaseClient);
          result = {
            projectsSynced: projectsResult.projectsSynced,
            issuesSynced: issuesResult.issuesSynced
          };
          recordsSynced = projectsResult.projectsSynced + issuesResult.issuesSynced;
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
    console.error('Jira connector error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function testConnection(baseUrl: string, auth: string): Promise<{ connected: boolean; user?: string }> {
  const response = await fetch(`${baseUrl}/myself`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Jira connection failed: ${error}`);
  }

  const user = await response.json();
  return { connected: true, user: user.displayName };
}

async function syncProjects(baseUrl: string, auth: string, supabase: any): Promise<{ projectsSynced: number }> {
  const response = await fetch(`${baseUrl}/project?expand=description,lead`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Jira projects: ${response.statusText}`);
  }

  const projects: JiraProject[] = await response.json();
  let synced = 0;

  for (const project of projects) {
    const projectData = {
      external_id: `jira-${project.id}`,
      source: 'jira',
      name: project.name,
      description: project.description || null,
      health: 'on-track',
      priority: 'medium',
      category: 'Software',
      raw_data: project
    };

    const { error } = await supabase
      .from('projects_sync')
      .upsert(projectData, { onConflict: 'external_id' });

    if (!error) synced++;
  }

  console.log(`Synced ${synced} Jira projects`);
  return { projectsSynced: synced };
}

async function syncIssues(baseUrl: string, auth: string, supabase: any, projectKey?: string): Promise<{ issuesSynced: number }> {
  const jql = projectKey ? `project = ${projectKey}` : 'order by created DESC';
  const response = await fetch(`${baseUrl}/search?jql=${encodeURIComponent(jql)}&maxResults=100`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Jira issues: ${response.statusText}`);
  }

  const data = await response.json();
  const issues: JiraIssue[] = data.issues || [];
  let synced = 0;

  for (const issue of issues) {
    // Map Jira status to our status
    const statusMap: { [key: string]: string } = {
      'To Do': 'todo',
      'In Progress': 'in-progress',
      'Done': 'done',
      'Backlog': 'backlog'
    };

    const taskData = {
      external_id: `jira-${issue.id}`,
      source: 'jira',
      project_external_id: `jira-${issue.fields.project.key}`,
      title: issue.fields.summary,
      description: issue.fields.description || null,
      status: statusMap[issue.fields.status.name] || 'todo',
      priority: issue.fields.priority?.name?.toLowerCase() || 'medium',
      assignee: issue.fields.assignee?.displayName || null,
      due_date: issue.fields.duedate || null,
      tags: [issue.fields.issuetype.name, issue.key],
      raw_data: issue
    };

    const { error } = await supabase
      .from('tasks_sync')
      .upsert(taskData, { onConflict: 'external_id' });

    if (!error) synced++;
  }

  console.log(`Synced ${synced} Jira issues`);
  return { issuesSynced: synced };
}
