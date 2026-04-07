import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

interface GraphMeeting {
  id: string;
  subject: string;
  bodyPreview?: string;
  organizer?: { emailAddress?: { name?: string; address?: string } };
  attendees?: Array<{ emailAddress?: { name?: string; address?: string }; status?: { response?: string } }>;
  start?: { dateTime?: string; timeZone?: string };
  end?: { dateTime?: string; timeZone?: string };
  joinWebUrl?: string;
  isOnlineMeeting?: boolean;
  onlineMeeting?: { joinUrl?: string };
}

interface GraphCallRecord {
  id: string;
  type?: string;
  startDateTime?: string;
  endDateTime?: string;
  organizer?: { user?: { displayName?: string; id?: string } };
  participants?: Array<{ user?: { displayName?: string; id?: string } }>;
}

interface RequestBody {
  action: string;
  access_token: string;
  date_from?: string;
  date_to?: string;
  meeting_id?: string;
  top?: number;
}

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

async function graphFetch(endpoint: string, token: string): Promise<unknown> {
  const res = await fetch(`${GRAPH_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Graph API error [${res.status}]: ${errText}`);
  }
  return await res.json();
}

function calcDuration(start?: string, end?: string): number | null {
  if (!start || !end) return null;
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as RequestBody;
    const { action, access_token, date_from, date_to, top = 50 } = body;

    if (!access_token) {
      return new Response(JSON.stringify({ error: "access_token is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!action) {
      return new Response(JSON.stringify({ error: "action is required (sync_meetings, sync_calendar, get_transcript)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let result: unknown;

    switch (action) {
      case "sync_meetings": {
        // Fetch online meetings and calendar events
        const dateFilter = date_from && date_to
          ? `?startDateTime=${date_from}&endDateTime=${date_to}&$top=${top}&$orderby=start/dateTime desc`
          : `?$top=${top}&$orderby=start/dateTime desc`;

        const calendarEndpoint = date_from && date_to
          ? `/me/calendarView${dateFilter}`
          : `/me/events?$top=${top}&$orderby=start/dateTime desc&$filter=isOnlineMeeting eq true`;

        const data = (await graphFetch(calendarEndpoint, access_token)) as { value: GraphMeeting[] };
        const meetings = data.value || [];

        const upsertData = meetings.map((m: GraphMeeting) => ({
          external_id: m.id,
          source: "microsoft_teams",
          title: m.subject || "Untitled Meeting",
          description: m.bodyPreview || null,
          organizer: m.organizer?.emailAddress?.name || null,
          organizer_email: m.organizer?.emailAddress?.address || null,
          attendees: (m.attendees || []).map((a) => ({
            name: a.emailAddress?.name || "Unknown",
            email: a.emailAddress?.address || "",
            response: a.status?.response || "none",
          })),
          start_time: m.start?.dateTime ? new Date(m.start.dateTime + "Z").toISOString() : null,
          end_time: m.end?.dateTime ? new Date(m.end.dateTime + "Z").toISOString() : null,
          duration_minutes: calcDuration(
            m.start?.dateTime ? m.start.dateTime + "Z" : undefined,
            m.end?.dateTime ? m.end.dateTime + "Z" : undefined
          ),
          status: m.start?.dateTime && new Date(m.start.dateTime + "Z") < new Date() ? "completed" : "scheduled",
          join_url: m.onlineMeeting?.joinUrl || m.joinWebUrl || null,
          metadata: { isOnlineMeeting: m.isOnlineMeeting },
          updated_at: new Date().toISOString(),
        }));

        if (upsertData.length > 0) {
          const { error: upsertError } = await supabase
            .from("meetings_sync")
            .upsert(upsertData, { onConflict: "external_id,source" });
          if (upsertError) throw new Error(`Upsert error: ${upsertError.message}`);
        }

        result = { synced: upsertData.length, meetings: upsertData };
        break;
      }

      case "sync_calendar": {
        // Fetch calendar view for a date range
        const from = date_from || new Date().toISOString();
        const to = date_to || new Date(Date.now() + 30 * 86400000).toISOString();

        const data = (await graphFetch(
          `/me/calendarView?startDateTime=${from}&endDateTime=${to}&$top=${top}&$orderby=start/dateTime`,
          access_token
        )) as { value: GraphMeeting[] };

        const events = (data.value || []).map((e: GraphMeeting) => ({
          external_id: e.id,
          source: "microsoft_teams",
          title: e.subject || "Untitled",
          organizer: e.organizer?.emailAddress?.name || null,
          organizer_email: e.organizer?.emailAddress?.address || null,
          attendees: (e.attendees || []).map((a) => ({
            name: a.emailAddress?.name,
            email: a.emailAddress?.address,
            response: a.status?.response,
          })),
          start_time: e.start?.dateTime ? new Date(e.start.dateTime + "Z").toISOString() : null,
          end_time: e.end?.dateTime ? new Date(e.end.dateTime + "Z").toISOString() : null,
          duration_minutes: calcDuration(
            e.start?.dateTime ? e.start.dateTime + "Z" : undefined,
            e.end?.dateTime ? e.end.dateTime + "Z" : undefined
          ),
          status: "scheduled",
          join_url: e.onlineMeeting?.joinUrl || e.joinWebUrl || null,
          metadata: { isOnlineMeeting: e.isOnlineMeeting },
          updated_at: new Date().toISOString(),
        }));

        if (events.length > 0) {
          const { error: upsertError } = await supabase
            .from("meetings_sync")
            .upsert(events, { onConflict: "external_id,source" });
          if (upsertError) throw new Error(`Upsert error: ${upsertError.message}`);
        }

        result = { synced: events.length, events };
        break;
      }

      case "get_transcript": {
        const { meeting_id } = body;
        if (!meeting_id) {
          return new Response(JSON.stringify({ error: "meeting_id is required" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Try to get call records and transcripts
        try {
          const callRecords = (await graphFetch(
            `/communications/callRecords?$filter=id eq '${meeting_id}'`,
            access_token
          )) as { value: GraphCallRecord[] };
          result = { callRecords: callRecords.value };
        } catch {
          // Fallback: try online meeting transcript
          try {
            const transcripts = (await graphFetch(
              `/me/onlineMeetings/${meeting_id}/transcripts`,
              access_token
            )) as { value: unknown[] };
            result = { transcripts: transcripts.value };
          } catch (innerErr: unknown) {
            const msg = innerErr instanceof Error ? innerErr.message : String(innerErr);
            result = { error: "Transcript not available", details: msg };
          }
        }

        // Update meeting record with transcript if available
        if (result && typeof result === "object" && "transcripts" in result) {
          const transcriptData = result as { transcripts: Array<{ content?: string }> };
          const transcriptContent = transcriptData.transcripts?.[0]?.content;
          if (transcriptContent) {
            await supabase
              .from("meetings_sync")
              .update({ transcript: transcriptContent, updated_at: new Date().toISOString() })
              .eq("external_id", meeting_id)
              .eq("source", "microsoft_teams");
          }
        }
        break;
      }

      case "get_recordings": {
        const { meeting_id } = body;
        if (!meeting_id) {
          return new Response(JSON.stringify({ error: "meeting_id is required" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        try {
          const recordings = (await graphFetch(
            `/me/onlineMeetings/${meeting_id}/recordings`,
            access_token
          )) as { value: Array<{ id: string; recordingContentUrl?: string; createdDateTime?: string }> };

          if (recordings.value?.length > 0) {
            const recordingUrl = recordings.value[0].recordingContentUrl;
            await supabase
              .from("meetings_sync")
              .update({
                recording_url: recordingUrl,
                recording_status: "available",
                updated_at: new Date().toISOString(),
              })
              .eq("external_id", meeting_id)
              .eq("source", "microsoft_teams");
          }

          result = { recordings: recordings.value };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          result = { error: "Recordings not available", details: msg };
        }
        break;
      }

      default: {
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}. Use: sync_meetings, sync_calendar, get_transcript, get_recordings` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Teams connector error:", message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
