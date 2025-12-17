import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { weekData } = await req.json();

    console.log("Generating weekly digest...");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("No content in AI response");
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

    console.log("Successfully generated weekly digest");

    return new Response(JSON.stringify(digestData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
