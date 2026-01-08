import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ParsedRow {
  [key: string]: string | number | boolean | null;
}

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  targetTable: 'projects' | 'tasks' | 'kpis';
}

interface ImportRequest {
  fileImportId: string;
  dataType: 'projects' | 'tasks' | 'kpis' | 'auto';
  columnMappings?: ColumnMapping[];
  parsedData?: {
    headers: string[];
    rows: ParsedRow[];
  };
}

// Auto-detect column mappings based on header names
function autoDetectMappings(headers: string[]): { dataType: 'projects' | 'tasks' | 'kpis'; mappings: Record<string, string> } {
  const headerLower = headers.map(h => h.toLowerCase().trim());
  
  // Check for project-like headers
  const projectIndicators = ['project', 'budget', 'progress', 'health', 'start date', 'end date', 'portfolio'];
  const taskIndicators = ['task', 'assignee', 'due date', 'status', 'priority', 'todo', 'done'];
  const kpiIndicators = ['kpi', 'metric', 'value', 'target', 'trend', 'indicator'];
  
  const projectScore = projectIndicators.filter(i => headerLower.some(h => h.includes(i))).length;
  const taskScore = taskIndicators.filter(i => headerLower.some(h => h.includes(i))).length;
  const kpiScore = kpiIndicators.filter(i => headerLower.some(h => h.includes(i))).length;
  
  let dataType: 'projects' | 'tasks' | 'kpis' = 'projects';
  if (taskScore > projectScore && taskScore > kpiScore) dataType = 'tasks';
  if (kpiScore > projectScore && kpiScore > taskScore) dataType = 'kpis';
  
  const mappings: Record<string, string> = {};
  
  // Map headers to target fields based on data type
  headers.forEach((header, idx) => {
    const h = header.toLowerCase().trim();
    
    if (dataType === 'projects') {
      if (h.includes('name') || h.includes('project') || h.includes('title')) mappings[header] = 'name';
      else if (h.includes('description') || h.includes('desc')) mappings[header] = 'description';
      else if (h.includes('health') || h.includes('status') || h.includes('rag')) mappings[header] = 'health';
      else if (h.includes('progress') || h.includes('complete') || h.includes('%')) mappings[header] = 'progress';
      else if (h.includes('budget')) mappings[header] = 'budget';
      else if (h.includes('spent') || h.includes('actual')) mappings[header] = 'spent';
      else if (h.includes('start')) mappings[header] = 'start_date';
      else if (h.includes('end') || h.includes('due') || h.includes('deadline')) mappings[header] = 'end_date';
      else if (h.includes('priority')) mappings[header] = 'priority';
      else if (h.includes('category') || h.includes('type')) mappings[header] = 'category';
      else if (h.includes('id') && idx === 0) mappings[header] = 'external_id';
    } else if (dataType === 'tasks') {
      if (h.includes('name') || h.includes('task') || h.includes('title') || h.includes('summary')) mappings[header] = 'title';
      else if (h.includes('description') || h.includes('desc')) mappings[header] = 'description';
      else if (h.includes('status') || h.includes('state')) mappings[header] = 'status';
      else if (h.includes('priority')) mappings[header] = 'priority';
      else if (h.includes('assignee') || h.includes('owner') || h.includes('assigned')) mappings[header] = 'assignee';
      else if (h.includes('due') || h.includes('deadline') || h.includes('date')) mappings[header] = 'due_date';
      else if (h.includes('project')) mappings[header] = 'project_external_id';
      else if (h.includes('tag') || h.includes('label')) mappings[header] = 'tags';
      else if (h.includes('id') && idx === 0) mappings[header] = 'external_id';
    } else if (dataType === 'kpis') {
      if (h.includes('name') || h.includes('title') || h.includes('kpi') || h.includes('metric')) mappings[header] = 'title';
      else if (h.includes('value') || h.includes('actual')) mappings[header] = 'value';
      else if (h.includes('change') || h.includes('delta')) mappings[header] = 'change';
      else if (h.includes('trend')) mappings[header] = 'trend';
      else if (h.includes('icon')) mappings[header] = 'icon';
    }
  });
  
  return { dataType, mappings };
}

// Normalize health/status values
function normalizeHealth(value: string | null): string {
  if (!value) return 'on-track';
  const v = String(value).toLowerCase().trim();
  if (v.includes('red') || v.includes('off') || v.includes('critical') || v.includes('delayed')) return 'off-track';
  if (v.includes('amber') || v.includes('yellow') || v.includes('at risk') || v.includes('warning')) return 'at-risk';
  return 'on-track';
}

// Normalize task status
function normalizeTaskStatus(value: string | null): string {
  if (!value) return 'todo';
  const v = String(value).toLowerCase().trim();
  if (v.includes('done') || v.includes('complete') || v.includes('closed') || v.includes('resolved')) return 'done';
  if (v.includes('progress') || v.includes('active') || v.includes('doing')) return 'in-progress';
  if (v.includes('review') || v.includes('blocked') || v.includes('hold')) return 'review';
  return 'todo';
}

// Normalize priority
function normalizePriority(value: string | null): string {
  if (!value) return 'medium';
  const v = String(value).toLowerCase().trim();
  if (v.includes('critical') || v.includes('urgent') || v === '1') return 'critical';
  if (v.includes('high') || v === '2') return 'high';
  if (v.includes('low') || v === '4' || v === '5') return 'low';
  return 'medium';
}

// Parse date strings
function parseDate(value: string | number | boolean | null): string | null {
  if (!value || typeof value === 'boolean') return null;
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}

// Parse number
function parseNumber(value: string | number | boolean | null): number | null {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean') return null;
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? null : num;
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

    const { fileImportId, dataType, parsedData }: ImportRequest = await req.json();

    // Get parsed data from file_imports if not provided
    let data = parsedData;
    if (!data && fileImportId) {
      const { data: fileImport, error: fetchError } = await supabaseClient
        .from('file_imports')
        .select('parsed_data, file_name')
        .eq('id', fileImportId)
        .single();
      
      if (fetchError || !fileImport?.parsed_data) {
        return new Response(JSON.stringify({ error: 'File not found or not parsed' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      data = fileImport.parsed_data as { headers: string[]; rows: ParsedRow[] };
    }

    if (!data || !data.headers || !data.rows) {
      return new Response(JSON.stringify({ error: 'No data to import' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Importing ${data.rows.length} rows, type: ${dataType || 'auto'}`);

    // Auto-detect data type and mappings
    const detection = autoDetectMappings(data.headers);
    const finalDataType = dataType === 'auto' ? detection.dataType : (dataType || detection.dataType);
    const mappings = detection.mappings;

    console.log(`Detected type: ${finalDataType}, mappings:`, mappings);

    let importedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    if (finalDataType === 'projects') {
      for (let i = 0; i < data.rows.length; i++) {
        const row = data.rows[i];
        try {
          // Generate external_id from row data or use row index
          const nameField = Object.keys(mappings).find(k => mappings[k] === 'name');
          const idField = Object.keys(mappings).find(k => mappings[k] === 'external_id');
          
          const name = nameField ? String(row[nameField] || '') : `Project ${i + 1}`;
          if (!name.trim()) continue; // Skip empty rows
          
          const externalId = idField ? String(row[idField]) : `file-import-${fileImportId}-${i}`;
          
          const projectData: Record<string, unknown> = {
            external_id: externalId,
            source: 'file_import',
            name: name.trim(),
            raw_data: row
          };

          // Map other fields
          Object.entries(mappings).forEach(([sourceCol, targetField]) => {
            const value = row[sourceCol];
            if (value === null || value === undefined || value === '') return;
            
            switch (targetField) {
              case 'description':
                projectData.description = String(value);
                break;
              case 'health':
                projectData.health = normalizeHealth(String(value));
                break;
              case 'progress':
                projectData.progress = parseNumber(value);
                break;
              case 'budget':
                projectData.budget = parseNumber(value);
                break;
              case 'spent':
                projectData.spent = parseNumber(value);
                break;
              case 'start_date':
                projectData.start_date = parseDate(value);
                break;
              case 'end_date':
                projectData.end_date = parseDate(value);
                break;
              case 'priority':
                projectData.priority = normalizePriority(String(value));
                break;
              case 'category':
                projectData.category = String(value);
                break;
            }
          });

          const { error: upsertError } = await supabaseClient
            .from('projects_sync')
            .upsert(projectData, { onConflict: 'external_id' });

          if (upsertError) {
            errors.push(`Row ${i + 1}: ${upsertError.message}`);
            skippedCount++;
          } else {
            importedCount++;
          }
        } catch (err) {
          errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          skippedCount++;
        }
      }
    } else if (finalDataType === 'tasks') {
      for (let i = 0; i < data.rows.length; i++) {
        const row = data.rows[i];
        try {
          const titleField = Object.keys(mappings).find(k => mappings[k] === 'title');
          const idField = Object.keys(mappings).find(k => mappings[k] === 'external_id');
          
          const title = titleField ? String(row[titleField] || '') : `Task ${i + 1}`;
          if (!title.trim()) continue;
          
          const externalId = idField ? String(row[idField]) : `file-import-${fileImportId}-task-${i}`;
          
          const taskData: Record<string, unknown> = {
            external_id: externalId,
            source: 'file_import',
            title: title.trim(),
            raw_data: row
          };

          Object.entries(mappings).forEach(([sourceCol, targetField]) => {
            const value = row[sourceCol];
            if (value === null || value === undefined || value === '') return;
            
            switch (targetField) {
              case 'description':
                taskData.description = String(value);
                break;
              case 'status':
                taskData.status = normalizeTaskStatus(String(value));
                break;
              case 'priority':
                taskData.priority = normalizePriority(String(value));
                break;
              case 'assignee':
                taskData.assignee = String(value);
                break;
              case 'due_date':
                taskData.due_date = parseDate(value);
                break;
              case 'project_external_id':
                taskData.project_external_id = String(value);
                break;
              case 'tags':
                taskData.tags = String(value).split(',').map(t => t.trim());
                break;
            }
          });

          const { error: upsertError } = await supabaseClient
            .from('tasks_sync')
            .upsert(taskData, { onConflict: 'external_id' });

          if (upsertError) {
            errors.push(`Row ${i + 1}: ${upsertError.message}`);
            skippedCount++;
          } else {
            importedCount++;
          }
        } catch (err) {
          errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          skippedCount++;
        }
      }
    } else if (finalDataType === 'kpis') {
      for (let i = 0; i < data.rows.length; i++) {
        const row = data.rows[i];
        try {
          const titleField = Object.keys(mappings).find(k => mappings[k] === 'title');
          const valueField = Object.keys(mappings).find(k => mappings[k] === 'value');
          
          const title = titleField ? String(row[titleField] || '') : `KPI ${i + 1}`;
          const value = valueField ? String(row[valueField] || '0') : '0';
          if (!title.trim()) continue;
          
          const kpiData: Record<string, unknown> = {
            id: undefined, // Let database generate
            source: 'file_import',
            title: title.trim(),
            value: value,
            raw_data: row
          };

          Object.entries(mappings).forEach(([sourceCol, targetField]) => {
            const val = row[sourceCol];
            if (val === null || val === undefined || val === '') return;
            
            switch (targetField) {
              case 'change':
                kpiData.change = parseNumber(val);
                break;
              case 'trend':
                kpiData.trend = String(val).toLowerCase().includes('up') ? 'up' : 
                               String(val).toLowerCase().includes('down') ? 'down' : 'stable';
                break;
              case 'icon':
                kpiData.icon = String(val);
                break;
            }
          });

          // For KPIs, we insert (no upsert since no unique external_id)
          const { error: insertError } = await supabaseClient
            .from('kpis_sync')
            .insert(kpiData);

          if (insertError) {
            errors.push(`Row ${i + 1}: ${insertError.message}`);
            skippedCount++;
          } else {
            importedCount++;
          }
        } catch (err) {
          errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          skippedCount++;
        }
      }
    }

    // Update file import record
    if (fileImportId) {
      await supabaseClient
        .from('file_imports')
        .update({
          status: 'imported',
          records_imported: importedCount
        })
        .eq('id', fileImportId);
    }

    console.log(`Import complete: ${importedCount} imported, ${skippedCount} skipped`);

    return new Response(JSON.stringify({
      success: true,
      data: {
        dataType: finalDataType,
        imported: importedCount,
        skipped: skippedCount,
        total: data.rows.length,
        errors: errors.slice(0, 10) // Return first 10 errors
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to import data';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
