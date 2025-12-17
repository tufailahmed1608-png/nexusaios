import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportType, projectData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating ${reportType} report...`);

    const systemPrompts: Record<string, string> = {
      'weekly-status': `You are an expert project management assistant. Generate a professional weekly status report based on the provided project data. The report should include:
- Executive Summary (2-3 sentences)
- Key Accomplishments This Week
- Tasks In Progress
- Upcoming Milestones
- Risks & Issues (if any)
- Resource Updates
- Action Items for Next Week

Format the report in clean markdown with clear sections. Be concise and professional.`,
      
      'monthly-summary': `You are an expert project management assistant. Generate a comprehensive monthly project summary based on the provided data. Include:
- Executive Overview
- Monthly Highlights & Achievements
- KPI Performance Summary
- Budget Status
- Timeline Progress
- Team Performance Insights
- Stakeholder Communication Summary
- Challenges & Mitigations
- Goals for Next Month
- Recommendations

Format in professional markdown with clear sections.`,
      
      'stakeholder-update': `You are an expert project management assistant. Generate a stakeholder update report suitable for executives. Include:
- Project Health Summary (Red/Yellow/Green status)
- Key Milestones Achieved
- Budget Overview
- Critical Decisions Needed
- Risk Summary
- Next 30-Day Outlook

Keep it concise (1 page equivalent). Use professional language suitable for C-level executives.`,
      
      'risk-assessment': `You are an expert project management assistant. Generate a risk assessment report based on the provided project data. Include:
- Risk Summary Dashboard
- High Priority Risks (detailed)
- Medium Priority Risks
- Risk Mitigation Status
- New Risks Identified
- Closed Risks
- Risk Trend Analysis
- Recommended Actions

Format in markdown with clear risk categorization.`,
      
      'team-performance': `You are an expert project management assistant. Generate a team performance report based on the provided data. Include:
- Team Performance Overview
- Productivity Metrics
- AI Efficiency Gains
- Individual Highlights
- Collaboration Insights
- Training & Development Needs
- Recognition & Achievements
- Recommendations for Improvement

Format in professional markdown.`
    };

    const systemPrompt = systemPrompts[reportType] || systemPrompts['weekly-status'];

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
          { 
            role: "user", 
            content: `Generate a ${reportType.replace('-', ' ')} report based on the following project data:\n\n${JSON.stringify(projectData, null, 2)}\n\nCurrent date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` 
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reportContent = data.choices?.[0]?.message?.content;

    if (!reportContent) {
      throw new Error("No report content generated");
    }

    console.log("Report generated successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      report: reportContent,
      generatedAt: new Date().toISOString(),
      reportType 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating report:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to generate report" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
