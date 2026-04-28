import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

// Map an integration_type to the edge function that performs the sync
const FUNCTION_MAP: Record<string, string> = {
  microsoft_teams: "teams-meetings-connector",
  outlook: "teams-meetings-connector", // calendar pulled via same connector for now
  microsoft_graph: "microsoft-graph-connector",
  jira: "jira-connector",
  azure_devops: "azuredevops-connector",
  servicenow: "servicenow-connector",
};

const FREQ_MS: Record<string, number> = {
  hourly: 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Optional: support manual single-integration trigger
  let body: { integration_id?: string; force?: boolean } = {};
  try { body = await req.json(); } catch { /* GET / cron */ }

  let query = supabase
    .from("integration_configs")
    .select("id,user_id,integration_type,sync_frequency,last_sync_at,is_active");

  if (body.integration_id) {
    query = query.eq("id", body.integration_id);
  } else {
    query = query.eq("is_active", true).in("sync_frequency", Object.keys(FREQ_MS));
  }

  const { data: configs, error } = await query;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const now = Date.now();
  const results: Array<Record<string, unknown>> = [];

  for (const cfg of configs ?? []) {
    const fnName = FUNCTION_MAP[cfg.integration_type];
    if (!fnName) {
      results.push({ id: cfg.id, skipped: "no_function_mapping" });
      continue;
    }

    if (!body.force) {
      const interval = FREQ_MS[cfg.sync_frequency];
      if (!interval) { results.push({ id: cfg.id, skipped: "manual_or_unknown_frequency" }); continue; }
      const last = cfg.last_sync_at ? new Date(cfg.last_sync_at).getTime() : 0;
      if (now - last < interval) { results.push({ id: cfg.id, skipped: "not_due" }); continue; }
    }

    // Log start
    const { data: log } = await supabase
      .from("integration_sync_logs")
      .insert({ integration_id: cfg.id, status: "running" })
      .select("id").single();

    try {
      const { data, error: invErr } = await supabase.functions.invoke(fnName, {
        body: { action: "sync", integration_id: cfg.id },
      });
      if (invErr) throw invErr;

      await supabase.from("integration_configs")
        .update({ last_sync_at: new Date().toISOString() })
        .eq("id", cfg.id);

      if (log?.id) {
        await supabase.from("integration_sync_logs").update({
          status: "success",
          completed_at: new Date().toISOString(),
          records_synced: (data as { count?: number })?.count ?? 0,
          sync_details: data ?? {},
        }).eq("id", log.id);
      }
      results.push({ id: cfg.id, ok: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (log?.id) {
        await supabase.from("integration_sync_logs").update({
          status: "failed",
          completed_at: new Date().toISOString(),
          error_message: msg,
        }).eq("id", log.id);
      }
      results.push({ id: cfg.id, ok: false, error: msg });
    }
  }

  return new Response(JSON.stringify({ ran: results.length, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
