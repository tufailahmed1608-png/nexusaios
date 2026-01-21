import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

interface ProjectData {
  external_id: string;
  name: string;
  description?: string;
  health?: 'on-track' | 'at-risk' | 'critical';
  progress?: number;
  budget?: number;
  spent?: number;
  start_date?: string;
  end_date?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  category?: string;
  team_data?: unknown[];
  milestones_data?: unknown[];
}

interface TaskData {
  external_id: string;
  project_external_id?: string;
  title: string;
  description?: string;
  status?: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority?: 'critical' | 'high' | 'medium' | 'low';
  assignee?: string;
  due_date?: string;
  tags?: string[];
}

interface KPIData {
  title: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: string;
}

interface SyncPayload {
  source?: string;
  projects?: ProjectData[];
  tasks?: TaskData[];
  kpis?: KPIData[];
}

// Validate input data
function validatePayload(body: unknown): { valid: boolean; error?: string; data?: SyncPayload } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid payload: expected object' };
  }

  const payload = body as SyncPayload;

  // Validate source
  if (payload.source && typeof payload.source !== 'string') {
    return { valid: false, error: 'Invalid source: expected string' };
  }

  // Validate projects array
  if (payload.projects) {
    if (!Array.isArray(payload.projects)) {
      return { valid: false, error: 'Invalid projects: expected array' };
    }
    if (payload.projects.length > 1000) {
      return { valid: false, error: 'Too many projects: max 1000 per request' };
    }
    for (const project of payload.projects) {
      if (!project.external_id || !project.name) {
        return { valid: false, error: 'Invalid project: external_id and name are required' };
      }
      if (typeof project.external_id !== 'string' || project.external_id.length > 255) {
        return { valid: false, error: 'Invalid project external_id' };
      }
      if (typeof project.name !== 'string' || project.name.length > 500) {
        return { valid: false, error: 'Invalid project name' };
      }
    }
  }

  // Validate tasks array
  if (payload.tasks) {
    if (!Array.isArray(payload.tasks)) {
      return { valid: false, error: 'Invalid tasks: expected array' };
    }
    if (payload.tasks.length > 5000) {
      return { valid: false, error: 'Too many tasks: max 5000 per request' };
    }
    for (const task of payload.tasks) {
      if (!task.external_id || !task.title) {
        return { valid: false, error: 'Invalid task: external_id and title are required' };
      }
      if (typeof task.external_id !== 'string' || task.external_id.length > 255) {
        return { valid: false, error: 'Invalid task external_id' };
      }
      if (typeof task.title !== 'string' || task.title.length > 500) {
        return { valid: false, error: 'Invalid task title' };
      }
    }
  }

  // Validate kpis array
  if (payload.kpis) {
    if (!Array.isArray(payload.kpis)) {
      return { valid: false, error: 'Invalid kpis: expected array' };
    }
    if (payload.kpis.length > 100) {
      return { valid: false, error: 'Too many KPIs: max 100 per request' };
    }
    for (const kpi of payload.kpis) {
      if (!kpi.title || !kpi.value) {
        return { valid: false, error: 'Invalid KPI: title and value are required' };
      }
    }
  }

  // Must have at least one data type
  if (!payload.projects?.length && !payload.tasks?.length && !payload.kpis?.length) {
    return { valid: false, error: 'No data provided: include projects, tasks, or kpis' };
  }

  return { valid: true, data: payload };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // ============ SECURITY: Require webhook secret (fail-safe) ============
    const webhookSecret = Deno.env.get('SYNC_WEBHOOK_SECRET');
    const providedSecret = req.headers.get('x-webhook-secret');

    // CRITICAL: If webhook secret is not configured, reject all requests (fail-safe)
    if (!webhookSecret) {
      console.error('SYNC_WEBHOOK_SECRET is not configured - rejecting request for security');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: webhook secret not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate the provided secret
    if (!providedSecret || webhookSecret !== providedSecret) {
      console.error('Invalid or missing webhook secret');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid webhook secret' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // ============ END SECURITY CHECK ============

    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validation = validatePayload(body);
    if (!validation.valid) {
      console.error('Validation error:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = validation.data!;
    const source = payload.source || 'microsoft_project';

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results = {
      projects: { upserted: 0, errors: 0 },
      tasks: { upserted: 0, errors: 0 },
      kpis: { inserted: 0, errors: 0 },
    };

    // Sync projects
    if (payload.projects?.length) {
      console.log(`Syncing ${payload.projects.length} projects from ${source}`);
      
      for (const project of payload.projects) {
        const { error } = await supabase
          .from('projects_sync')
          .upsert({
            external_id: project.external_id,
            source,
            name: project.name,
            description: project.description || null,
            health: project.health || 'on-track',
            progress: project.progress || 0,
            budget: project.budget || 0,
            spent: project.spent || 0,
            start_date: project.start_date || null,
            end_date: project.end_date || null,
            priority: project.priority || 'medium',
            category: project.category || null,
            team_data: project.team_data || [],
            milestones_data: project.milestones_data || [],
            raw_data: project,
          }, {
            onConflict: 'external_id,source',
          });

        if (error) {
          console.error('Error upserting project:', error);
          results.projects.errors++;
        } else {
          results.projects.upserted++;
        }
      }
    }

    // Sync tasks
    if (payload.tasks?.length) {
      console.log(`Syncing ${payload.tasks.length} tasks from ${source}`);
      
      for (const task of payload.tasks) {
        const { error } = await supabase
          .from('tasks_sync')
          .upsert({
            external_id: task.external_id,
            source,
            project_external_id: task.project_external_id || null,
            title: task.title,
            description: task.description || null,
            status: task.status || 'todo',
            priority: task.priority || 'medium',
            assignee: task.assignee || null,
            due_date: task.due_date || null,
            tags: task.tags || [],
            raw_data: task,
          }, {
            onConflict: 'external_id,source',
          });

        if (error) {
          console.error('Error upserting task:', error);
          results.tasks.errors++;
        } else {
          results.tasks.upserted++;
        }
      }
    }

    // Sync KPIs (replace all KPIs for this source)
    if (payload.kpis?.length) {
      console.log(`Syncing ${payload.kpis.length} KPIs from ${source}`);
      
      // Delete existing KPIs for this source
      await supabase.from('kpis_sync').delete().eq('source', source);

      for (const kpi of payload.kpis) {
        const { error } = await supabase
          .from('kpis_sync')
          .insert({
            source,
            title: kpi.title,
            value: kpi.value,
            change: kpi.change || 0,
            trend: kpi.trend || 'stable',
            icon: kpi.icon || 'activity',
            raw_data: kpi,
          });

        if (error) {
          console.error('Error inserting KPI:', error);
          results.kpis.errors++;
        } else {
          results.kpis.inserted++;
        }
      }
    }

    console.log('Sync completed:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data synced successfully',
        results,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
