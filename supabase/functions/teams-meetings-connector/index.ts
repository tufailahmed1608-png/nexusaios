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
  date_from?: string;
  date_to?: string;
  meeting_id?: string;
  top?: number;
  user_id?: string;
}

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

async function getAccessToken(): Promise<string> {
  const tenantId = Deno.env.get("AZURE_AD_TENANT_ID");
  const clientId = Deno.env.get("AZURE_AD_CLIENT_ID");
  const clientSecret = Deno.env.get("AZURE_AD_CLIENT_SECRET");

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Azure AD credentials not configured. Set AZURE_AD_TENANT_ID, AZURE_AD_CLIENT_ID, and AZURE_AD_CLIENT_SECRET.");
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to obtain access token [${res.status}]: ${errText}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

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
    const { action, date_from, date_to, top = 50, user_id } = body;

    if (!action) {
      return new Response(JSON.stringify({ error: "action is required (sync_meetings, sync_calendar, get_transcript, get_recordings)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Obtain access token via client credentials flow
    const access_token = await getAccessToken();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let result: unknown;

    switch (action) {
      case "sync_meetings": {
        // For application permissions, use /users/{userId}/events or /users
        // With client_credentials we need a specific user or use /users endpoint
        const userPath = user_id ? `/users/${user_id}` : "/users";

        let meetings: GraphMeeting[] = [];

        if (user_id) {
          // Sync a specific user's meetings
          const dateFilter = date_from && date_to
            ? `?startDateTime=${date_from}&endDateTime=${date_to}&$top=${top}&$orderby=start/dateTime desc`
            : `?$top=${top}&$orderby=start/dateTime desc&$filter=isOnlineMeeting eq true`;

          const calendarEndpoint = date_from && date_to
            ? `${userPath}/calendarView${dateFilter}`
            : `${userPath}/events?$top=${top}&$orderby=start/dateTime desc&$filter=isOnlineMeeting eq true`;

          const data = (await graphFetch(calendarEndpoint, access_token)) as { value: GraphMeeting[] };
          meetings = data.value || [];
        } else {
          // Try to list users and get meetings from the first few
          try {
            const usersData = (await graphFetch("/users?$top=10&$select=id,displayName,mail", access_token)) as {
              value: Array<{ id: string; displayName?: string; mail?: string }>;
            };

            for (const u of (usersData.value || []).slice(0, 5)) {
              try {
                const eventsData = (await graphFetch(
                  `/users/${u.id}/events?$top=${top}&$orderby=start/dateTime desc&$filter=isOnlineMeeting eq true`,
                  access_token
                )) as { value: GraphMeeting[] };
                meetings.push(...(eventsData.value || []));
              } catch {
                // Skip users we can't access
              }
            }
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            throw new Error(`Cannot list users. Provide a user_id or grant User.Read.All permission. Error: ${msg}`);
          }
        }

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
        const from = date_from || new Date().toISOString();
        const to = date_to || new Date(Date.now() + 30 * 86400000).toISOString();
        const userPath = user_id ? `/users/${user_id}` : "";

        if (!user_id) {
          return new Response(JSON.stringify({ error: "user_id is required for sync_calendar with application permissions" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const data = (await graphFetch(
          `${userPath}/calendarView?startDateTime=${from}&endDateTime=${to}&$top=${top}&$orderby=start/dateTime`,
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

        try {
          const callRecords = (await graphFetch(
            `/communications/callRecords?$filter=id eq '${meeting_id}'`,
            access_token
          )) as { value: GraphCallRecord[] };
          result = { callRecords: callRecords.value };
        } catch {
          try {
            const userPrefix = user_id ? `/users/${user_id}` : "/me";
            const transcripts = (await graphFetch(
              `${userPrefix}/onlineMeetings/${meeting_id}/transcripts`,
              access_token
            )) as { value: unknown[] };
            result = { transcripts: transcripts.value };
          } catch (innerErr: unknown) {
            const msg = innerErr instanceof Error ? innerErr.message : String(innerErr);
            result = { error: "Transcript not available", details: msg };
          }
        }

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
          const userPrefix = user_id ? `/users/${user_id}` : "/me";
          const recordings = (await graphFetch(
            `${userPrefix}/onlineMeetings/${meeting_id}/recordings`,
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
