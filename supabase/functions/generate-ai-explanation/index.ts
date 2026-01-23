import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExplanationRequest {
  type: 'report' | 'risk';
  context: Record<string, unknown>;
  outputContent?: string;
}

function validateInput(body: unknown): { valid: boolean; error?: string; data?: ExplanationRequest } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: "Invalid request body" };
  }

  const { type, context, outputContent } = body as Record<string, unknown>;

  if (typeof type !== 'string' || !['report', 'risk'].includes(type)) {
    return { valid: false, error: "type must be 'report' or 'risk'" };
  }

  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return { valid: false, error: "context must be an object" };
  }

  return {
    valid: true,
    data: {
      type: type as 'report' | 'risk',
      context: context as Record<string, unknown>,
      outputContent: typeof outputContent === 'string' ? outputContent : undefined,
    },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

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

    const { type, context, outputContent } = validation.data!;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Generating ${type} explanation for user:`, user.id);

    const systemPrompt = `You are an AI transparency and explainability assistant. Your role is to explain how AI-generated outputs were created, what data was used, and what factors influenced the results.

Provide explanations that are:
- Clear and non-technical for business users
- Honest about limitations and confidence levels
- Specific about what data sources were used
- Transparent about the reasoning process

Respond with a JSON object in this exact format:
{
  "model": "Gemini 2.5 Flash",
  "confidence": 0.85,
  "reasoning": "A 2-3 sentence explanation of how this output was generated and why",
  "dataSources": ["source1", "source2"],
  "factors": [
    {
      "name": "Factor name",
      "weight": 0.3,
      "description": "Brief description of how this factor influenced the output"
    }
  ]
}

Confidence should be between 0 and 1. Weights should sum to approximately 1.`;

    let userPrompt: string;

    interface ProjectData {
      team?: { size?: number };
      tasks?: { total?: number };
      budget?: { allocated?: number };
      risks?: unknown[];
      aiMetrics?: Record<string, unknown>;
    }

    interface RiskFactor {
      name: string;
      score: number;
      impact: string;
    }

    if (type === 'report') {
      const projectData = context.projectData as ProjectData | undefined;
      userPrompt = `Explain how this AI-generated report was created.

Report Type: ${context.reportType || 'Unknown'}
Project Data Analyzed:
- Team Size: ${projectData?.team?.size || 'N/A'}
- Tasks: ${projectData?.tasks?.total || 'N/A'} total
- Budget: $${projectData?.budget?.allocated?.toLocaleString() || 'N/A'}
- Risks Identified: ${projectData?.risks?.length || 0}
- AI Metrics Available: ${Object.keys(projectData?.aiMetrics || {}).length} data points

${outputContent ? `Report excerpt: ${outputContent.substring(0, 500)}...` : ''}

Explain what data was used, how the AI analyzed it, and what factors most influenced the report content.`;
    } else {
      userPrompt = `Explain how this AI risk prediction was generated.

Project: ${context.projectName || 'Unknown'}
Risk Score: ${context.riskScore || 'N/A'}/100
Delay Probability: ${context.delayProbability || 'N/A'}%
Predicted Delay: ${context.predictedDelay || 'N/A'} days
Trend: ${context.trend || 'N/A'}

Risk Factors Analyzed:
${Array.isArray(context.riskFactors) 
  ? (context.riskFactors as RiskFactor[]).map(f => `- ${f.name}: ${f.score}/100 (${f.impact} impact)`).join('\n')
  : 'No factors provided'}

Explain how the AI analyzed these risk factors, what patterns it identified, and how it arrived at the predictions.`;
    }

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
      return new Response(JSON.stringify({ error: "Failed to generate explanation" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: "No content in AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the JSON response
    let explanation;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        explanation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      explanation = {
        model: "Gemini 2.5 Flash",
        confidence: 0.75,
        reasoning: content.substring(0, 300),
        dataSources: ["Project data", "Historical patterns"],
        factors: [
          {
            name: "Input Data Quality",
            weight: 0.5,
            description: "Based on the completeness and relevance of provided data"
          },
          {
            name: "Pattern Recognition",
            weight: 0.5,
            description: "Analysis of trends and correlations in the data"
          }
        ]
      };
    }

    const processingTime = Date.now() - startTime;

    console.log("Successfully generated explanation for user:", user.id);

    return new Response(JSON.stringify({
      ...explanation,
      generatedAt: new Date().toISOString(),
      processingTime,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-ai-explanation function:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
