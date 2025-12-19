import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation constants
const MAX_WEEK_DATA_LENGTH = 50000;

function validateInput(body: unknown): { valid: boolean; error?: string; data?: Record<string, unknown> } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: "Invalid request body" };
  }

  const { weekData } = body as Record<string, unknown>;

  if (!weekData || typeof weekData !== 'object' || Array.isArray(weekData)) {
    return { valid: false, error: "weekData must be an object" };
  }

  // Check serialized length to prevent extremely large payloads
  const serialized = JSON.stringify(weekData);
  if (serialized.length > MAX_WEEK_DATA_LENGTH) {
    return { valid: false, error: `weekData exceeds maximum size of ${MAX_WEEK_DATA_LENGTH} characters` };
  }

  return {
    valid: true,
    data: weekData as Record<string, unknown>,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse and validate input
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validation = validateInput(body);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const weekData = validation.data!;

    console.log("Generating weekly digest for user:", user.id);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a senior project management assistant creating executive weekly status summaries. 
Your reports should be:
- Concise but comprehensive
- Focused on outcomes and impact
- Highlighting risks and blockers
- Celebrating wins and progress
- Actionable with clear next steps

Return a JSON object with this structure:
{
  "executiveSummary": "2-3 sentence high-level overview",
  "weekHighlights": [
    { "icon": "🎯", "title": "Highlight title", "description": "Brief description" }
  ],
  "projectUpdates": [
    {
      "name": "Project name",
      "status": "on-track" | "at-risk" | "delayed",
      "progress": 75,
      "keyUpdate": "Most important update this week",
      "nextMilestone": "Next milestone description"
    }
  ],
  "tasksOverview": {
    "completed": 12,
    "inProgress": 8,
    "blocked": 2,
    "highlight": "Notable task achievement"
  },
  "risksAndBlockers": [
    { "severity": "high" | "medium" | "low", "description": "Risk description", "mitigation": "Suggested mitigation" }
  ],
  "teamPerformance": {
    "velocity": "Description of team velocity",
    "recognition": "Team member or achievement to recognize"
  },
  "nextWeekPriorities": [
    "Priority 1",
    "Priority 2",
    "Priority 3"
  ],
  "actionItems": [
    { "owner": "Person name", "action": "Action description", "due": "Due date" }
  ]
}`;

    const userPrompt = `Generate a comprehensive weekly digest based on this project data:

${JSON.stringify(weekData, null, 2)}

Create an executive-friendly weekly status report summarizing progress, highlights, risks, and priorities for the coming week.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Failed to generate digest" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      return new Response(JSON.stringify({ error: "No content in AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let digestData;
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        digestData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      digestData = {
        executiveSummary: aiContent.substring(0, 300),
        weekHighlights: [],
        projectUpdates: [],
        tasksOverview: { completed: 0, inProgress: 0, blocked: 0, highlight: "" },
        risksAndBlockers: [],
        teamPerformance: { velocity: "", recognition: "" },
        nextWeekPriorities: [],
        actionItems: []
      };
    }

    console.log("Successfully generated weekly digest for user:", user.id);

    return new Response(JSON.stringify(digestData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
