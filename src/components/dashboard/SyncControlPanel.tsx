import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Plug, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type Frequency = "manual" | "hourly" | "daily" | "weekly";

interface IntegrationConfig {
  id: string;
  name: string;
  integration_type: string;
  sync_frequency: Frequency;
  last_sync_at: string | null;
  is_active: boolean;
}

const FREQ_OPTIONS: { value: Frequency; label: string }[] = [
  { value: "manual", label: "Manual only" },
  { value: "hourly", label: "Every hour" },
  { value: "daily", label: "Once a day" },
  { value: "weekly", label: "Once a week" },
];

const SyncControlPanel = () => {
  const [configs, setConfigs] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("integration_configs")
      .select("id,name,integration_type,sync_frequency,last_sync_at,is_active")
      .order("name");
    if (error) toast.error(error.message);
    else setConfigs((data ?? []) as IntegrationConfig[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateFrequency = async (id: string, freq: Frequency) => {
    const { error } = await supabase
      .from("integration_configs")
      .update({ sync_frequency: freq })
      .eq("id", id);
    if (error) return toast.error(error.message);
    setConfigs((c) => c.map((x) => (x.id === id ? { ...x, sync_frequency: freq } : x)));
    toast.success(`Sync frequency updated to ${freq}`);
  };

  const syncOne = async (id: string) => {
    setSyncingId(id);
    try {
      const { data, error } = await supabase.functions.invoke("run-scheduled-syncs", {
        body: { integration_id: id, force: true },
      });
      if (error) throw error;
      const result = (data as { results?: Array<{ ok?: boolean; error?: string }> })?.results?.[0];
      if (result?.ok) toast.success("Sync complete");
      else toast.error(result?.error ?? "Sync failed");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncingId(null);
    }
  };

  const syncAll = async () => {
    setSyncingAll(true);
    try {
      const { data, error } = await supabase.functions.invoke("run-scheduled-syncs", {
        body: { force: true },
      });
      if (error) throw error;
      const ran = (data as { ran?: number })?.ran ?? 0;
      toast.success(`Triggered sync for ${ran} integration${ran === 1 ? "" : "s"}`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncingAll(false);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Plug className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">Data Sources</h3>
          <Badge variant="secondary">{configs.length}</Badge>
        </div>
        <Button size="sm" onClick={syncAll} disabled={syncingAll || configs.length === 0}>
          <RefreshCw className={`h-4 w-4 mr-2 ${syncingAll ? "animate-spin" : ""}`} />
          Sync all now
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading integrations…</p>
      ) : configs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No integrations configured yet. Connect Microsoft 365, Jira, or other sources from the Integrations page.
        </p>
      ) : (
        <div className="space-y-3">
          {configs.map((cfg) => (
            <div
              key={cfg.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-md border border-border bg-muted/30"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground truncate">{cfg.name}</p>
                  <Badge variant="outline" className="text-xs">{cfg.integration_type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" />
                  {cfg.last_sync_at
                    ? `Last synced ${formatDistanceToNow(new Date(cfg.last_sync_at), { addSuffix: true })}`
                    : "Never synced"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={cfg.sync_frequency}
                  onValueChange={(v) => updateFrequency(cfg.id, v as Frequency)}
                >
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQ_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => syncOne(cfg.id)}
                  disabled={syncingId === cfg.id}
                >
                  <RefreshCw className={`h-4 w-4 ${syncingId === cfg.id ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default SyncControlPanel;
