import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { action, integrationId, service, msConfig } = await req.json();

    // Get integration config from database or use provided config
    let config = msConfig;
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

    if (!config?.accessToken) {
      return new Response(JSON.stringify({ 
        error: 'Missing Microsoft Graph access token. Please authenticate first.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const graphBaseUrl = 'https://graph.microsoft.com/v1.0';

    console.log(`Microsoft Graph connector action: ${action} for service: ${service}`);

    // Create sync log
    let syncLogId: string | null = null;
    if (integrationId) {
      const { data: syncLog } = await supabaseClient
        .from('integration_sync_logs')
        .insert({
          integration_id: integrationId,
          status: 'running',
          sync_details: { action, service }
        })
        .select('id')
        .single();
      syncLogId = syncLog?.id;
    }

    let result;
    let recordsSynced = 0;

    try {
      switch (service) {
        case 'sharepoint':
          result = await handleSharePoint(action, config.accessToken, graphBaseUrl, supabaseClient, config);
          recordsSynced = result.recordsSynced || 0;
          break;
        case 'teams':
          result = await handleTeams(action, config.accessToken, graphBaseUrl, supabaseClient);
          recordsSynced = result.recordsSynced || 0;
          break;
        case 'outlook':
          result = await handleOutlook(action, config.accessToken, graphBaseUrl, supabaseClient);
          recordsSynced = result.recordsSynced || 0;
          break;
        case 'planner':
          result = await handlePlanner(action, config.accessToken, graphBaseUrl, supabaseClient);
          recordsSynced = result.recordsSynced || 0;
          break;
        default:
          throw new Error(`Unknown service: ${service}`);
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
    console.error('Microsoft Graph connector error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleSharePoint(action: string, accessToken: string, baseUrl: string, supabase: any, config: any) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json'
  };

  switch (action) {
    case 'test':
      const meResponse = await fetch(`${baseUrl}/me`, { headers });
      if (!meResponse.ok) throw new Error('SharePoint connection failed');
      const me = await meResponse.json();
      return { connected: true, user: me.displayName };

    case 'sync_sites':
      const sitesResponse = await fetch(`${baseUrl}/sites?search=*`, { headers });
      if (!sitesResponse.ok) throw new Error('Failed to fetch SharePoint sites');
      const sites = await sitesResponse.json();
      console.log(`Found ${sites.value?.length || 0} SharePoint sites`);
      return { recordsSynced: sites.value?.length || 0, sites: sites.value };

    case 'sync_lists':
      if (!config.siteId) throw new Error('Site ID required for list sync');
      const listsResponse = await fetch(`${baseUrl}/sites/${config.siteId}/lists`, { headers });
      if (!listsResponse.ok) throw new Error('Failed to fetch SharePoint lists');
      const lists = await listsResponse.json();
      
      // Sync list items that look like project data
      let totalSynced = 0;
      for (const list of lists.value || []) {
        if (list.displayName.toLowerCase().includes('project') || 
            list.displayName.toLowerCase().includes('task')) {
          const itemsResponse = await fetch(
            `${baseUrl}/sites/${config.siteId}/lists/${list.id}/items?expand=fields`,
            { headers }
          );
          if (itemsResponse.ok) {
            const items = await itemsResponse.json();
            for (const item of items.value || []) {
              const projectData = {
                external_id: `sp-${list.id}-${item.id}`,
                source: 'sharepoint',
                name: item.fields?.Title || `SharePoint Item ${item.id}`,
                description: item.fields?.Description || null,
                health: 'on-track',
                priority: 'medium',
                raw_data: item
              };
              
              await supabase
                .from('projects_sync')
                .upsert(projectData, { onConflict: 'external_id' });
              totalSynced++;
            }
          }
        }
      }
      return { recordsSynced: totalSynced };

    default:
      throw new Error(`Unknown SharePoint action: ${action}`);
  }
}

async function handleTeams(action: string, accessToken: string, baseUrl: string, supabase: any) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json'
  };

  switch (action) {
    case 'test':
      const meResponse = await fetch(`${baseUrl}/me`, { headers });
      if (!meResponse.ok) throw new Error('Teams connection failed');
      const me = await meResponse.json();
      return { connected: true, user: me.displayName };

    case 'sync_teams':
      const teamsResponse = await fetch(`${baseUrl}/me/joinedTeams`, { headers });
      if (!teamsResponse.ok) throw new Error('Failed to fetch Teams');
      const teams = await teamsResponse.json();
      console.log(`Found ${teams.value?.length || 0} Teams`);
      return { recordsSynced: teams.value?.length || 0, teams: teams.value };

    case 'sync_channels':
      const joinedTeamsResponse = await fetch(`${baseUrl}/me/joinedTeams`, { headers });
      if (!joinedTeamsResponse.ok) throw new Error('Failed to fetch Teams');
      const joinedTeams = await joinedTeamsResponse.json();
      
      let totalChannels = 0;
      for (const team of joinedTeams.value || []) {
        const channelsResponse = await fetch(
          `${baseUrl}/teams/${team.id}/channels`,
          { headers }
        );
        if (channelsResponse.ok) {
          const channels = await channelsResponse.json();
          totalChannels += channels.value?.length || 0;
        }
      }
      return { recordsSynced: totalChannels };

    case 'sync_meetings':
      const calendarResponse = await fetch(
        `${baseUrl}/me/calendar/events?$filter=isOnlineMeeting eq true&$top=50`,
        { headers }
      );
      if (!calendarResponse.ok) throw new Error('Failed to fetch meetings');
      const meetings = await calendarResponse.json();
      console.log(`Found ${meetings.value?.length || 0} online meetings`);
      return { recordsSynced: meetings.value?.length || 0, meetings: meetings.value };

    default:
      throw new Error(`Unknown Teams action: ${action}`);
  }
}

async function handleOutlook(action: string, accessToken: string, baseUrl: string, supabase: any) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json'
  };

  switch (action) {
    case 'test':
      const meResponse = await fetch(`${baseUrl}/me`, { headers });
      if (!meResponse.ok) throw new Error('Outlook connection failed');
      const me = await meResponse.json();
      return { connected: true, user: me.displayName, email: me.mail };

    case 'sync_emails':
      const emailsResponse = await fetch(
        `${baseUrl}/me/messages?$top=50&$orderby=receivedDateTime desc`,
        { headers }
      );
      if (!emailsResponse.ok) throw new Error('Failed to fetch emails');
      const emails = await emailsResponse.json();
      console.log(`Found ${emails.value?.length || 0} recent emails`);
      return { recordsSynced: emails.value?.length || 0, emails: emails.value };

    case 'sync_calendar':
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const oneMonthAhead = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      
      const calendarResponse = await fetch(
        `${baseUrl}/me/calendar/calendarView?startDateTime=${oneMonthAgo.toISOString()}&endDateTime=${oneMonthAhead.toISOString()}&$top=100`,
        { headers }
      );
      if (!calendarResponse.ok) throw new Error('Failed to fetch calendar events');
      const events = await calendarResponse.json();
      console.log(`Found ${events.value?.length || 0} calendar events`);
      return { recordsSynced: events.value?.length || 0, events: events.value };

    default:
      throw new Error(`Unknown Outlook action: ${action}`);
  }
}

async function handlePlanner(action: string, accessToken: string, baseUrl: string, supabase: any) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json'
  };

  switch (action) {
    case 'test':
      const meResponse = await fetch(`${baseUrl}/me`, { headers });
      if (!meResponse.ok) throw new Error('Planner connection failed');
      const me = await meResponse.json();
      return { connected: true, user: me.displayName };

    case 'sync_plans':
      const plansResponse = await fetch(`${baseUrl}/me/planner/plans`, { headers });
      if (!plansResponse.ok) throw new Error('Failed to fetch Planner plans');
      const plans = await plansResponse.json();
      
      let totalSynced = 0;
      for (const plan of plans.value || []) {
        const projectData = {
          external_id: `planner-${plan.id}`,
          source: 'microsoft_planner',
          name: plan.title,
          description: null,
          health: 'on-track',
          priority: 'medium',
          raw_data: plan
        };
        
        await supabase
          .from('projects_sync')
          .upsert(projectData, { onConflict: 'external_id' });
        totalSynced++;
      }
      
      return { recordsSynced: totalSynced, plans: plans.value };

    case 'sync_tasks':
      const myTasksResponse = await fetch(`${baseUrl}/me/planner/tasks`, { headers });
      if (!myTasksResponse.ok) throw new Error('Failed to fetch Planner tasks');
      const tasks = await myTasksResponse.json();
      
      let tasksSynced = 0;
      for (const task of tasks.value || []) {
        const percentMap: { [key: number]: string } = {
          0: 'todo',
          50: 'in-progress',
          100: 'done'
        };

        const taskData = {
          external_id: `planner-${task.id}`,
          source: 'microsoft_planner',
          project_external_id: `planner-${task.planId}`,
          title: task.title,
          description: null,
          status: percentMap[task.percentComplete] || 'todo',
          priority: task.priority <= 3 ? 'high' : task.priority <= 5 ? 'medium' : 'low',
          due_date: task.dueDateTime || null,
          raw_data: task
        };
        
        await supabase
          .from('tasks_sync')
          .upsert(taskData, { onConflict: 'external_id' });
        tasksSynced++;
      }
      
      return { recordsSynced: tasksSynced };

    default:
      throw new Error(`Unknown Planner action: ${action}`);
  }
}
