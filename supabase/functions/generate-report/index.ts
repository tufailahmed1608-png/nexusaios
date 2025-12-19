import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_PROJECT_DATA_LENGTH = 50000;
const VALID_REPORT_TYPES = ['weekly-status', 'monthly-summary', 'stakeholder-update', 'risk-assessment', 'team-performance'];

interface ValidatedInput {
  reportType: string;
  projectData: Record<string, unknown>;
}

function validateInput(body: unknown): { valid: boolean; error?: string; data?: ValidatedInput } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: "Invalid request body" };
  }

  const { reportType, projectData } = body as Record<string, unknown>;

  if (typeof reportType !== 'string' || !VALID_REPORT_TYPES.includes(reportType)) {
    return { valid: false, error: `reportType must be one of: ${VALID_REPORT_TYPES.join(', ')}` };
  }

  if (!projectData || typeof projectData !== 'object' || Array.isArray(projectData)) {
    return { valid: false, error: "projectData must be an object" };
  }

  // Check serialized length to prevent extremely large payloads
  const serialized = JSON.stringify(projectData);
  if (serialized.length > MAX_PROJECT_DATA_LENGTH) {
    return { valid: false, error: `projectData exceeds maximum size of ${MAX_PROJECT_DATA_LENGTH} characters` };
  }

  return {
    valid: true,
    data: {
      reportType,
      projectData: projectData as Record<string, unknown>,
    },
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse and validate input
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validation = validateInput(body);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { reportType, projectData } = validation.data!;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Generating ${reportType} report for user:`, user.id);

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
      console.error("AI gateway error:", response.status);
      
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
      
      return new Response(JSON.stringify({ error: "Failed to generate report" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reportContent = data.choices?.[0]?.message?.content;

    if (!reportContent) {
      return new Response(JSON.stringify({ error: "No report content generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Report generated successfully for user:", user.id);

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
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
